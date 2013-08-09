import time
import dryscrape
import sys

#==========================================
# Setup
#==========================================

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
#sess.visit('http://vk.com/page-4569_6127355')
#sess.visit('http://vk.com/page-4569_6127500')
#sess.visit('http://vk.com/pages?oid=-4569&p=%D0%91%D0%B0%D0%B7%D0%B0_%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D1%85._%C2%AB%D0%90%D0%B4_%D0%94%D0%B0%D0%BD%D1%82%D0%B5%C2%BB')
#sess.visit('http://vk.com/pages?oid=-4569&p=%D0%91%D0%B0%D0%B7%D0%B0_%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D1%85._%C2%AB%D0%90%D0%B4_%D0%94%D0%B0%D0%BD%D1%82%D0%B5%C2%BB&z=photo-4569_119138542%2F3605f5e5cb053e86ba')

print sess.source()

"""
# visit homepage and log in
print "Logging in..."
sess.visit('/')

email_field    = sess.at_css('#Email')
password_field = sess.at_css('#Passwd')
email_field.set(email)
password_field.set(password)

email_field.form().submit()

# find the COMPOSE button and click it
print "Sending a mail..."
compose = sess.at_xpath('//*[contains(text(), "COMPOSE")]')
compose.click()

# compose the mail
to      = sess.at_xpath('//*[@name="to"]', timeout=10)
subject = sess.at_xpath('//*[@name="subject"]')
body    = sess.at_xpath('//*[@name="body"]')

to.set(email)
subject.set("Note to self")
body.set("Remember to try dryscrape!")

# send the mail

# seems like we need to wait a bit before clicking...
# Blame Google for this ;)
time.sleep(3)
send = sess.at_xpath('//*[normalize-space(text()) = "Send"]')
send.click()

# open the mail
print "Reading the mail..."
mail = sess.at_xpath('//*[normalize-space(text()) = "Note to self"]',
                     timeout=10)
mail.click()

# sleep a bit to leave the mail a chance to open.
# This is ugly, it would be better to find something
# on the resulting page that we can wait for
time.sleep(3)

# save a screenshot of the web page
print "Writing screenshot to 'gmail.png'"
sess.render('gmail.png')
"""
