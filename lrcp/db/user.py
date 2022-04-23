from tortoise import Model, fields


class User(Model):
    username: str = fields.CharField(max_length=128, pk=True)
    full_name: str = fields.CharField(max_length=512, null=True)
    email: str = fields.CharField(max_length=1024, null=True)
    password: str = fields.CharField(max_length=1024)
    totp: str = fields.CharField(max_length=32, null=True)
    is_active: bool = fields.BooleanField(default=False)

    class Meta:
        db_table = 'users'
