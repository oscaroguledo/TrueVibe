
#[derive(serde::Serialize, Clone, Debug)]
pub struct Message {
    pub id: String,
    pub sender: String,
    pub user: String,
    pub room: String,
    pub text: String,
    pub subroom: String,
    pub date: String,
}
