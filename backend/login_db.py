from pydantic import BaseModel,Field
sessions={}
class LoginDB(BaseModel):
    login_map:dict=Field(default_factory=dict) #username-password key-value pair
    expert_user:dict=Field(default_factory=dict) #username-yes/no key-value pair

class LoggedInUsers(BaseModel):
    logged_in_users:dict=Field(default_factory=dict) #username-cookie_id key-value pair