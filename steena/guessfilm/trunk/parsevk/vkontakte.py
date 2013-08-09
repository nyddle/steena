import time
import dryscrape

#==========================================
# Setup
#==========================================

email    = 'nyddle@gmail.com'
password = 'sandro'

# set up a web scraping session
sess = dryscrape.Session(base_url = 'https://vk.com/')

# there are some failing HTTP requests, so we need to enter
# a more error-resistant mode (like real browsers do)
sess.set_error_tolerant(True)

# we don't need images
sess.set_attribute('auto_load_images', False)

# if we wanted, we could also configure a proxy server to use,
# so we can for example use Fiddler to monitor the requests
# performed by this script
#sess.set_proxy('localhost', 8888)

#==========================================
# GMail send a mail to self
#==========================================

print "Logging in..."
sess.visit('/')

time.sleep(3)

email_field    = sess.at_css('#quick_email')
password_field = sess.at_css('#quick_pass')

email_field.set(email)
password_field.set(password)

email_field.form().submit()

time.sleep(3)
#sess.visit('/drugoe_kino')
#sess.visit('http://vk.com/page-4569_6127355')
#sess.visit('http://vk.com/page-4569_6127500')
#sess.visit('http://vk.com/pages?oid=-4569&p=%D0%91%D0%B0%D0%B7%D0%B0_%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D1%85._%C2%AB%D0%90%D0%B4_%D0%94%D0%B0%D0%BD%D1%82%D0%B5%C2%BB')
#sess.visit('http://vk.com/pages?oid=-4569&p=%D0%91%D0%B0%D0%B7%D0%B0_%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D1%85._%C2%AB%D0%90%D0%B4_%D0%94%D0%B0%D0%BD%D1%82%D0%B5%C2%BB&z=photo-4569_119138542%2F3605f5e5cb053e86ba')


sess.visit('http://vk.com/pages?oid=-4569&p=%D0%90%D0%BB%D1%8C%D0%B1%D0%BE%D0%BC%D1%8B_%C2%AB%D0%A3%D0%B3%D0%B0%D0%B4%D0%B0%D0%B9_%D1%84%D0%B8%D0%BB%D1%8C%D0%BC_%D0%BF%D0%BE_%D0%BA%D0%B0%D0%B4%D1%80%D1%83%C2%BB._%D0%91%D0%B0%D0%B7%D0%B0_%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D1%85')
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
