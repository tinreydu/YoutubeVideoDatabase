from flask import Flask,render_template, request
from google.cloud.sql.connector import Connector
import sqlalchemy
import pymysql
connector = Connector()
app = Flask(__name__)
import random
import json
import string

def generate_user_id():
    user_id = random.randint(1, 1000)
    return user_id

def connect_with_connector() -> sqlalchemy.engine.base.Engine:
    """
    Initializes a connection pool for a Cloud SQL instance of MySQL.

    Uses the Cloud SQL Python Connector package.
    """
    # Note: Saving credentials in environment variables is convenient, but not
    # secure - consider a more secure solution such as
    # Cloud Secret Manager (https://cloud.google.com/secret-manager) to help
    # keep secrets safe.

    connector = Connector()

    def getconn() -> pymysql.connections.Connection:
        # connector = Connector()
        conn: pymysql.connections.Connection = connector.connect(
            "cs411-welovedb:us-central1:cs411-welovedb",
            "pymysql",
            user="root",
            password="hRSYVH\DduZ,v;:X",
            db="welovedb"
        )
    # print(conn)
        return conn

    pool = sqlalchemy.create_engine(
        "mysql+pymysql://",
        creator=getconn,
        # ...
    )
    return pool

# @app.route("/geninfo")
# def generate_userinfo():
#     response = {}
#     return json.dumps(response)

@app.route("/test")
def test_world():
    return "<p>Test, World!</p>"

@app.route("/update",methods = ['GET','PUT'])
def update_data():
    if request.method == "PUT":
        pool = connect_with_connector()
        tag_id = request.args.get('tag_id')
        tag_description = request.args.get('tag_description')
        update_stmt = sqlalchemy.text(
            f"""
            UPDATE Tags
            SET tag_description = {tag_description}
            WHERE tag_id = {tag_id}";
            """,
            )
        select_after_update_stmt = sqlalchemy.text(
            f"""
            SELECT tag_id, tag_description
            FROM Tags
            WHERE tag_id = {tag_id}";
            """,
            )
        res_lst = []
        with pool.connect() as db_conn:
            db_conn.execute(update_stmt)
            res = db_conn.execute(select_after_update_stmt).fetchall()
            for row in res:
                res_lst.append(row)
            db_conn.commit()
        return "The entry after update is: \t" + str(res_lst)
    return "Only PUT is supported"

@app.route("/search")
def search_data():
    pool = connect_with_connector()
    channel_title = request.args.get('channel_title')
    # response = "Response is: " + scheduled_departure_date + " : " + origin_airport + " : " +destination_airport
    search_stmt = sqlalchemy.text(
        f"""SELECT video_id, video_title, uploaded_date, channel_title, view_count, like_count
            FROM Videos
            WHERE channel_title = {channel_title}"
        """,
    )
    result_list = []
    with pool.connect() as db_conn:
    #     # insert into database
        result = db_conn.execute(search_stmt).fetchall()
    #     # Do something with the results
        for row in result:
            result_list.append(row)
        db_conn.commit()
    return str(result_list)

@app.route("/delete", methods=["DELETE"])
def delete_data():
    if request.method == "DELETE":
        pool = connect_with_connector()
        tag_id = request.args.get('tag_id')
        with pool.connect() as db_conn:
            delete_stmt = sqlalchemy.text(
                f"""
                DELETE FROM Tags
                WHERE tag_id = {tag_id}
                """
            )
            db_conn.execute(delete_stmt)
            select_after_delete_stmt = sqlalchemy.text(
                f"""
                SELECT *
                FROM Tags
                WHERE tag_id = {tag_id}
                """
            )
            res = db_conn.execute(select_after_delete_stmt).fetchall()
            if(len(res) == 0):
                db_conn.commit()
                return "Success Deletion!"
            
            return "Failed! Something went wrong"
    return "Only delete is supported"

@app.route("/insert", methods=["POST", "GET"])
def insert_data():
    pool = connect_with_connector()
    user_id = request.args.get('user_id')
    user_name = request.args.get('user_name')
    user_email = request.args.get('user_email')
    user_password = request.args.get('user_password')
    if request.method == "GET":
        get_stmt = sqlalchemy.text(
            f"""
            SELECT user_id, user_name, user_email, user_password
            FROM Users
            WHERE user_id = {user_id} AND user_name = "{user_name}" AND user_email = {user_email} AND user_password = {user_password}
            """
            )
        res_lst_get = []
        with pool.connect() as db_conn:
            res = db_conn.execute(get_stmt).fetchall()
            for row in res:
                res_lst_get.append(row)
            db_conn.commit()
        return str(res_lst_get)
            
    elif request.method == "POST":
        res_lst = []
        count_stmt = sqlalchemy.text(
            f"""
            SELECT COUNT(user_id)
            FROM Users
            WHERE user_id = {user_id}"
            """
            )
        count = -1
        with pool.connect() as db_conn:
            count = db_conn.execute(count_stmt).fetchall()[0][0]
            print(count)
            segment_id = count + 1
            insert_stmt = sqlalchemy.text(
                f"""
                INSERT INTO Users
                VALUES({user_id}, "{user_name}", "{user_email}", "{user_password}")
                """
            )
            db_conn.execute(insert_stmt)
            select_stmt = sqlalchemy.text(
                f"""
                SELECT *
                FROM Users
                WHERE user_id = {user_id}"
                """
            )
            res = db_conn.execute(select_stmt).fetchall()
            for row in res:
                res_lst.append(row)
            db_conn.commit()  
        return "Success! This is what you just inserted: \t" + str(res_lst)
    
@app.route("/viewadvancedq1")
def advancedQ1():
    pool = connect_with_connector()
    # Finding videos which either have more likes than the average number of likes or more views than the average number of views
    select_user_q1 = """SELECT video_title
                    FROM Videos
                    WHERE like_count > (SELECT AVG(like_count) FROM Videos)
                    UNION
                    SELECT video_title
                    FROM Videos
                    WHERE view_count > (SELECT AVG(view_count) FROM Videos)
                    LIMIT 15;
                    """
    result_lst = []
    select_stmt = sqlalchemy.text(select_user_q1,)
    with pool.connect() as db_conn:
        # insert into database
        result = db_conn.execute(select_stmt).fetchall()
        # Do something with the results
        for row in result:
            result_lst.append(row)
        db_conn.commit()
    return str(result_lst)

@app.route("/viewadvancedq2")
def advancedQ2():
    pool = connect_with_connector()
    # Finding most popular tags of trending YouTube videos
    select_user_q2 = """SELECT t.tag_id, COUNT(v.video_id)
                    FROM Videos v NATURAL JOIN Video_Tags vt JOIN Tags t ON (vt.tag_id = t.tag_id)
                    GROUP BY t.tag_id
                    ORDER BY COUNT(v.video_id) DESC
                    LIMIT 15;
                    """
    select_stmt = sqlalchemy.text(select_user_q2,)
    result_lst = []
    with pool.connect() as db_conn:
        # insert into database
        result = db_conn.execute(select_stmt).fetchall()
        # Do something with the results
        for row in result:
            result_lst.append(row[0])
        db_conn.commit()
    return str(result_lst)