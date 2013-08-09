import time
import dryscrape
import sys
import hashlib

email    = 'nyddle@gmail.com'
password = 'sandro'

sess = dryscrape.Session(base_url = 'https://vk.com/')
sess.set_error_tolerant(True)
sess.set_attribute('auto_load_images', False)

print "Logging in..."
sess.visit('/')
time.sleep(4)
email_field    = sess.at_css('#quick_email')
password_field = sess.at_css('#quick_pass')

email_field.set(email)
password_field.set(password)
email_field.form().submit()

time.sleep(4)


films = open('film_links')
for line in films.readlines():
    #print line.rstrip()[1:]
    sess.visit(line.rstrip())
    time.sleep(5)
    file = open('parsed_films/' + hashlib.sha224(line).hexdigest(), "w")
    file.write(sess.source())
    file.close()

#print hashlib.sha224("Nobody inspects the spammish repetition").hexdigest()
