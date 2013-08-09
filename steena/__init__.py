#!/usr/bin/python
# -*- coding: utf8

import os
import sys
# Notice: use  """ only for documentation strings. If it describe function or class, it should be INSIDE this item
# For other comments use #( press ctrl + / for multiline comment in PyCharm). And forget about ';' :)
# In Python you should use True or False - not true or TRUE.
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

import facebook as fb
import vkontakte as vk

from werkzeug.security import generate_password_hash, \
    check_password_hash


import redis


r = redis.StrictRedis.from_url(os.getenv('REDISCLOUD_URL', 'redis://127.0.0.1:6379'))
if (not r):
    sys.exit(1)

#redis://rediscloud:EYsJhb2kD4MnCvW1@pub-redis-19659.us-east-1-2.1.ec2.garantiadata.com:19659
#r = redis.StrictRedis.from_url('redis://rediscloud:EYsJhb2kD4MnCvW1@pub-redis-19659.us-east-1-2.1.ec2.garantiadata.com:19659')

from pprint import pprint
from inspect import getmembers


from RedisSessionStore import *


ADMINS = [u'vk1210352', u'fb825509556']


env = 'debug'

# TODO:
# if config is None:
#     config = os.path.join(app.root_path, 'production.cfg')
#
# app.config.from_pyfile(config)
#

"""
Vkontakte test:
ID приложения:  3706801
Защищенный ключ:    5AP5clufqwBPqZ8yE9YJ


The Heap Test
App ID: 532091683492935
App Secret: 30ccf1d094307a8edabdc64103ca9d05

"""

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
if env == 'debug':
    app.debug = True
if env == 'prod':
    app.debug = False

if app.debug:
    from flaskext.lesscss import lesscss

    lesscss(app)
app.static_path = '/static'

#app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:////tmp/flask_app.db')
heroku = Heroku(app)
gzapp = Gzip(app)

"""
OAUTH STUFF
"""

SECRET_KEY = 'development key'
DEBUG = True
FACEBOOK_APP_ID = os.getenv('FACEBOOK_APP_ID', '532091683492935')#'114091315454409'
FACEBOOK_APP_SECRET = os.getenv('FACEBOOK_APP_SECRET',
                                '30ccf1d094307a8edabdc64103ca9d05') #'95310a6e453b063025c9bf672096eaf5'
VKONTAKTE_APP_ID = os.getenv('VKONTAKTE_APP_ID', '3706801') #'3698600'
VKONTAKTE_APP_SECRET = os.getenv('VKONTAKTE_APP_SECRET', '5AP5clufqwBPqZ8yE9YJ') #'TrZKHQ860aoa5bEVk3Ja'
TWITTER_APP_ID = os.getenv('TWITTER_APP_ID', 'KA18RP9odbGRSv7m0TFtw') #'3698600'
TWITTER_APP_SECRET = os.getenv('TWITTER_APP_SECRET',
                               'kjs5OqKG4WbKjcS7tUOTlC1FqBNSeGEOINoXtQewj6Y') #'TrZKHQ860aoa5bEVk3Ja'

oauth = OAuth()

strategies = {}

strategies['vkontakte'] = oauth.remote_app('vk-app',
                                           base_url='https://oauth.vk.com/',
                                           request_token_url=None,
                                           access_token_url='https://oauth.vk.com/access_token',
                                           authorize_url='http://oauth.vk.com/authorize',
                                           consumer_key=VKONTAKTE_APP_ID,
                                           consumer_secret=VKONTAKTE_APP_SECRET,
)

@app.route('/postvk')
def postvk():
    vk_api = vk.API(token=session['oauth_token'][0])
    vk_api.wall.post(message="dsvdsv", redirect_uri='http://api.vk.com/blank.html')
    #'https://api.vk.com/method/getProfiles?uid='+str(user_id)+'&access_token='+session['oauth_token']
    return 'Posted!'


@app.route('/login/<strategy>')
def login(strategy):
    return strategies[strategy].authorize(callback=url_for(strategy + '_authorized', strategy=strategy,
                                                           next=request.args.get('next') or request.referrer or None,
                                                           redirect_uri='http://www.itimes.ru',
                                                           _external=True))


vkontakte = strategies['vkontakte']


@app.route('/login/authorized/vkontakte')
@vkontakte.authorized_handler
def vkontakte_authorized(resp):
    next_url = request.args.get('next') or url_for('index')
    if resp is None:
        flash(u'You denied the request to sign in.')
        return redirect(next_url)

    strategy = 'vkontakte'
    session['oauth_token'] = (resp['access_token'], '')
    user_id = resp['user_id']
    me = strategies[strategy].get(
        'https://api.vk.com/method/getProfiles?uid=' + str(user_id) + '&access_token=' + resp['access_token'])
    response = me.data['response'][0]
    username = response['first_name'] + ' ' + response['last_name']
    user_id = 'vk' + str(user_id)
    user = get_user_by_id(user_id)   #User.query.filter_by(name=resp['screen_name']).first()
    # user never signed on
    if ((user is None) or (len(user.keys()) == 0)):
        usr = create_social_user(user_id, username, resp['access_token'])

    """
    # in any case we update the authenciation token in the db
    # In case the user temporarily revoked access we will have
    # new tokens here.
    user.oauth_token = resp['oauth_token']
    user.oauth_secret = resp['oauth_token_secret']
    """
    update_access_token(user_id, resp['access_token'])
    session['user_id'] = user_id
    flash('You were signed in')
    return redirect(next_url)


@vkontakte.tokengetter
def get_vkontakte_oauth_token():
    return session.get('oauth_token')

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    session.pop('oauth_token', None)
    flash('You were signed out')
    return redirect(request.referrer or url_for('index'))



