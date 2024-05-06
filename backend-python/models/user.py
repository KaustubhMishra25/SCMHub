class User:

    def __init__(self, email, password, business_details=None):
        self.email = email
        self.password = password
        self.business_details = business_details

    def verify_password(db_password, candidate_password):
        return db_password == candidate_password

    @classmethod
    def create_user(cls, client, data):
        # Connect to MongoDB (replace with your connection details)
        db = client.scmhub
        users_collection = db.users

        # Validate and insert user data
        if not data.get('email') or not data.get('password'):
            raise ValueError("Email and password are required fields")
        user = User(data['email'], data['password'], data.get('business_details'))

        # Ensure unique email using pymongo's index with unique constraint
        users_collection.create_index([("email", 1)], unique=True)
        users_collection.insert_one(user.__dict__)
        return user

    @classmethod
    def find_user_by_email(cls, client, email, password):
        # Connect to MongoDB (replace with your connection details)
        db = client.scmhub
        users_collection = db.users
        user_data = users_collection.find_one({'email': email})
        # Find user by email
        return user_data


# Example usage
# client = MongoClient(os.environ.get('MONGODB_URI'))
# user = User.create_user(client, {'email': 'test@example.com', 'password': 'secret123', 'business_details': {'company': 'ABC'}})
# found_user = User.find_user_by_email(client, 'test@example.com')

# if found_user:
#     print(f"Found user: {found_user['email']}")
#     # Check password (replace with your verify_password implementation)
#     if user.verify_password('secret123'):
#         print("Password is valid")
#     else:
#         print("Password is incorrect")

# client.close()
