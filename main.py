import meinheld
from flaskr import create_app
app = create_app()
meinheld.set_max_content_length(2**10 * 2**10 * 2**10 * 1) # 1 GB
