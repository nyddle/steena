#!/usr/bin/python
# -*- coding: utf8

import os
import sys
reload(sys)
sys.setdefaultencoding('utf-8')

import datetime
from time import time
import json
import bson

import tldextract

from flask import Flask, request, session, g, redirect, url_for, abort, \
    render_template, flash, jsonify, Response
from flask.ext.assets import Environment, Bundle
from flask.ext.heroku import Heroku
from flask_oauth import OAuth
from flask.ext.gzip import Gzip

from werkzeug.security import generate_password_hash, \
    check_password_hash

import cloudinary
import cloudinary.uploader
import cloudinary.api
from cloudinary.uploader import upload
from cloudinary.utils import cloudinary_url

import redis

from cloudinary import uploader #pip install git+https://github.com/cloudinary/pycloudinary/

r = redis.StrictRedis.from_url(os.getenv('REDISCLOUD_URL', 'redis://127.0.0.1:6379'))
if (not r):
    sys.exit(1)

from pprint import pprint
from inspect import getmembers

from RedisSessionStore import *

app = MyFlask(__name__)
# session params
app.config['SESSION_REDIS_HOST'] = os.getenv('REDISCLOUD_URL', 'redis://127.0.0.1:6379')
app.config['SESSION_REDIS_DB'] = 1

app.config['SESSION_KEY'] = '3425234535'
app.config['SESSION_KEY_PREFIX'] = 'session_myapp_'

app.config['SESSION_LIFETIME'] = 86400 * 20

RedisSessionStore.init_app(app)

app.config.from_object(__name__)
app.config['SECRET_KEY'] = 'devkey'
# set the secret key.  keep this really secret:
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
app.config.update(SECRET_KEY=os.urandom(20))
if app.debug:
    from flaskext.lesscss import lesscss

    lesscss(app)
app.static_path = '/static'

heroku = Heroku(app)
gzapp = Gzip(app)

class Cloudinary(object):
  def __init__(self, app):
    config = app.config['CLOUDINARY_URL'].split('://')[1]
    config = config.replace("@", ":")
    self.api_key, self.api_secret, self.name = config.split(":")

  def upload_image(self, image):
    keys = {'public_id': 2002}
    res = uploader.call_api(
      "upload",
      uploader.build_upload_params(**keys),
      api_key=self.api_key,
      api_secret=self.api_secret,
      cloud_name=self.name,
      file=image.stream,
    )
    return res

app.config['MAX_CONTENT_LENGTH'] = 16 * 16 * 1024 * 1024
app.config['CLOUDINARY_URL'] = "cloudinary://916694617537676:uBOf1k7Ot9sYMwq30AU0A0boXvY@hmtpkyvtl" #XXX: feel free to use this URL, upload whatever you like ;)
#cloudinary = Cloudinary(app)

ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

SECRET_KEY = 'development key'
DEBUG = True

app.config['DEBUG'] = True

@app.route('/')
def index():
    return render_template('home.html')



@app.route("/upload", methods=['GET', 'POST'])
def upload():
  if request.method == "POST":
    response = cloudinary.uploader.upload(request.files['image'])
    return str(response)

  return '<html><body><form action="" method=post enctype=multipart/form-data><input type=file name=image /><input type=submit /></form></body></html>'

"""
{u'secure_url': u'https://res.cloudinary.com/ummwut/image/upload/v1376132166/1001.gif', u'public_id': u'1001', u'format': u'gif', u'url': u'http://res.cloudinary.com/ummwut/image/upload/v1376132166/1001.gif', u'created_at': u'2013-08-10T10:56:06Z', u'bytes': 614274, u'height': 302, u'width': 288, u'version': 1376132166, u'signature': u'573f5b4a5947a0f185371f559c7d96cb3071ee36', u'type': u'upload', u'pages': 40, u'resource_type': u'image'}
"""


