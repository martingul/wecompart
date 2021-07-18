from jinja2 import Environment, PackageLoader, select_autoescape
# from weasyprint import HTML

env = Environment(
    loader=PackageLoader('api', 'templates'),
    autoescape=select_autoescape(['html', 'xml'])
)

def html_to_pdf(html):
    # return HTML(string=html).write_pdf()
    return