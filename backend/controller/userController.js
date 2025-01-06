const { User, validateUser, validateUserPatch } = require('../models/userModel'); // Import the User model and Joi validation
const { paginate } = require('../utils/paginationUtil'); // Assuming you have a pagination utility
const { logAuditAction } = require('../utils/logAuditAction');
const { Permission,createJwtToken } = require('../middlewares/validateUserPermission');
const { default: Response } = require('../utils/defaultResponseObject');
const { hashPassword, comparePassword, generateSalt } = require('../utils/encryption');

// Create User
const createUser = async (req, res) => {
  try {
    // Validate input data using Joi
    const { error, value } = validateUser(req.body);
    if (error) {
      return Response(res, 400,error.details[0].message);
    }

    // Check if the user already exists
    const existingUser = await User.findOne({
      $or: [{ email: value.email }, { username: value.username }]
    });
    if (existingUser) {
      return Response(res, 400,'User with this email or username already exists.');
    }

    // Create a new user
    const user = new User(value);
    await user.save();
    const payload ={
          id:user.id,
          email: user.email,
          full_name: user.firstname,
          username: user.username,
    }
    const token = createJwtToken(payload, user.password_hash);
    // console.log('Generated JWT Token:', token);
    // Log the action in the background
    // await logAuditAction(
    //     user._id,
    //     'create',
    //     `Created a User: ${user._id}`,
    //     { user_id: user._id, email:user.email }
    // );

    const data = { ...user._doc, token };
    
    return Response(res,201,  'User created successfully',data)
    
  } catch (err) {
    return Response(res, 500, null, null, err);
  }
};

// Get All Users
// Get all users with pagination
const getAllUsers = async (req, res) => {
  try {
    // Destructure page and limit from query parameters, with defaults
    const { page = 1, limit = 10 } = req.query;

    // Use the paginate utility to fetch users
    const query = {};
    const { data: users, pagination } = await paginate(User, query, page, limit);

    if (users.length === 0) {
      return Response(res, 400,'No users found');
    }

    // Return the paginated users with pagination metadata
    const data = { users, pagination };
    return Response(res, 200,'Users retrieved successfully',data);
    
  } catch (err) {
    return Response(res, 500);
  }
};

// Get User by ID
const getUserById = async (req, res) => {
  const { user_id } = req.params;
  const haspermission = await Permission(req);
  if (!haspermission) {
      return Response(res, 403);
  }
  try {
    const user = await User.findOne({ id:user_id });
    if (!user) {
      return Response(res, 400,'User not found');
    }
    return Response(res, 200,'User retrieved successfully',user);
  } catch (err) {
    return Response(res, 500);
  }
};

// Update User
const updateUser = async (req, res) => {
  const { user_id } = req.params;
  const haspermission = await Permission(req);
  if (!haspermission) {
      return Response(res, 403);
  }
  try {
    // Validate input data using Joi
    const { error, value } = validateUserPatch(req.body);
    if (error) {
      return Response(res, 400,error.details[0].message);
    }
    

    // Check if user exists
    const user = await User.findOneAndUpdate({ id:user_id }, value, {
      new: true,
      runValidators: true,
    });
    console.log(user)
    if (!user) {
      return Response(res, 404,'User not found');
    }

    // Log the action in the background
    // await logAuditAction(
    //   user_id,
    //   'update',
    //   `Updated a User: ${user._id}`,
    //   { user_id: user._id}
    // );
    return Response(res, 200,'User updated successfully',user);
    
  } catch (err) {
    return Response(res, 500 );
  }
};

// Delete User
const deleteUser = async (req, res) => {
  const { user_id } = req.params;
  const haspermission = await Permission(req);
  if (!haspermission) {
      return Response(res, 403);
  }
  try {
    const user = await User.findOneAndDelete({ id:user_id });
    if (!user) {
      return Response(res, 404,'User not found');
    }

    // Log the action in the background
    // await logAuditAction(
    //   user_id,
    //   'delete',
    //   `Deleted a User: ${user._id}`,
    //   { user_id: user._id}
    // );
    return Response(res, 200,'User deleted successfully' );
  } catch (err) {
    console.error(err);
    return Response(res, 500 );
  }
};

// User Login (authentication)
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password){
    return Response(res, 400,'Invalid email or password' );
  }
  try {
    // Validate the user login credentials
    const user = await User.findOne({ email });
    if (!user) {
      return Response(res, 400,'Invalid email' );
    }

    // Compare the entered password with the hashed password
    const isMatch = await comparePassword(password, user.password_hash);
    
    if (!isMatch) {
      return Response(res, 400,'Invalid password' );
    }

    // Generate a JWT token for the logged-in user
    
    const payload ={
          id:user.id,
          email: user.email,
          full_name: user.firstname,
          username: user.username,
    }
    const token = createJwtToken(payload, user.password_hash);
    return Response(res, 200,'Login successful',token );
    
  } catch (err) {
    return Response(res, 500);
  }
};

// Change Password
const changePassword = async (req, res) => {
    const { user_id } = req.params;
    const { oldPassword, newPassword } = req.body;
    // const haspermission = await Permission(req);
    // if (!haspermission) {
    //     return Response(res, 403);
    // }
    try {
      // Find the user by user_id
        const user = await User.findOne({ id:user_id });
        if (!user) {
          return Response(res, 404,'User not found' );
        }

        // Compare the old password with the current password
        // Compare the entered password with the hashed password
        
        const isMatch = await comparePassword(oldPassword, user.password_hash);
        if (!isMatch) {
          return Response(res, 400,'Old password is incorrect' );
        }

        // Hash the new password and save it
        const salt = generateSalt();  // Generate a random salt
        user.password_hash = await hashPassword(newPassword, salt);  // Hash the password with the salt
        console.log(user.password_hash, newPassword)
        await user.save();

        // Log the action in the background
        // await logAuditAction(
        //   user_id,
        //   'update',
        //   `Updated a User Password: ${user._id}`,
        //   { user_id: user._id}
        // );
        return Response(res, 200,'Password changed successfully' );
    } catch (err) {
        console.log(err,'+++')
        return Response(res, 500 );
    }
};

// Update User Profile Picture
const updateProfilePicture = async (req, res) => {
  
    const haspermission = await Permission(req);
    if (!haspermission) {
        return Response(res, 403);
    }

    try {
        // Validate input data using Joi
        const { error, value } = validateUserPatch(req.body);
        if (error) {
            return Response(res, 400, error.details[0].message);
        }
      
        // Find the user and update the profile picture
        const user = await User.findOneAndUpdate(
            { id:haspermission.decodedPayload.id },
            { profile_picture_url:value.profile_picture_url },
            { new: true }
        );

        if (!user) {
            return Response(res, 404,'User not found');
        }

        // Log the action in the background
        // await logAuditAction(
        //     user_id,
        //     'update',
        //     `Updated a User Profile Picture: ${user._id}`,
        //     { user_id: user._id}
        // );
      
      return Response(res, 200, 'Profile picture updated successfully');
      
    } catch (err) {
      return Response(res, 500 );
    }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  changePassword,
  updateProfilePicture,
};
