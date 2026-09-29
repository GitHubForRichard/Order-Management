from flask_mail import Mail, Message

mail = Mail()


def init_mail(app):
    """Initialize Flask-Mail with app config."""
    mail.init_app(app)


def send_email(subject, recipients, body, sender=None, attachments=None):
    """Send an email via Flask-Mail"""
    msg = Message(
        subject=subject,
        recipients=recipients,
        body=body,
        sender=sender
    )
    for filename, content_type, data in attachments or []:
        msg.attach(filename, content_type, data)
    mail.send(msg)
