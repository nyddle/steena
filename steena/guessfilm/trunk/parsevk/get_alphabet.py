import time
import dryscrape
import sys

#==========================================
# Setup
#==========================================

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


alphabetic = open('alphabet')
for line in alphabetic.readlines():
    #print line.rstrip()[1:]
    sess.visit(line.rstrip())
    time.sleep(5)
    file = open(line.rstrip()[1:], "w")
    file.write(sess.source())
    file.close()


"""
page_url = sys.argv[1]

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
sess.visit(page_url)
"""

