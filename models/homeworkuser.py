from flask_sqlalchemy import SQLAlchemy

Db = SQLAlchemy()


class HomeworkUser(Db.Model):
    __tablename__ = 'homework_users'
    uid = Db.Column(Db.Integer, primary_key=True, autoincrement=True)
    username = Db.Column(Db.String(64), nullable=False)
    first_name = Db.Column(Db.String(64), nullable=False)
    last_name = Db.Column(Db.String(64), nullable=False)
    prog_lang = Db.Column(Db.String(64), nullable=False)
    experience_yr = Db.Column(Db.Float, nullable=False)
    age = Db.Column(Db.Integer, nullable=False)
    hw1_hrs = Db.Column(Db.Float, nullable=False)
