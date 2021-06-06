import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import config

context = ssl.create_default_context()

smtp_username = config.credentials.get('smtp_username')

# Create message container - the correct MIME type is multipart/alternative.
message = MIMEMultipart('alternative')
message['Subject'] = "Link"
message['From'] = smtp_username
message['To'] = smtp_username

# Create the body of the message (a plain-text and an HTML version).
text = '''\
Hi!\nHow are you?\nHere is the link you wanted:\nhttp://www.python.org
'''

html = '''\
<html>
  <head></head>
  <body>
    <p>Hi!<br>
       How are you?<br>
       Here is the <a href="http://www.python.org">link</a> you wanted.
    </p>
  </body>
</html>
'''

# Record the MIME types of both parts - text/plain and text/html.
part1 = MIMEText(text, 'plain')
part2 = MIMEText(html, 'html')

# Attach parts into message container.
# According to RFC 2046, the last part of a multipart message, in this case
# the HTML message, is best and preferred.
message.attach(part1)
message.attach(part2)

def send_email(dst_email: str, message: MIMEMultipart):
    smtp_username = config.credentials.get('smtp_username')
    smtp_password = config.credentials.get('smtp_password')
    with smtplib.SMTP_SSL(config.smtp_host, config.smtp_port,
        context=context) as server:
        server.login(smtp_username, smtp_password)
        server.sendmail(smtp_username, dst_email, message.as_string())