# Covideo Dailies Server
This is the Server Application with is supposed to go with Viewer Apps und DIT Desktop Clients in the future. It manages the data of every film projects, exposes them to an API and has an integrated Web Application, which is for now used to manage and view Footage and Metadata.
The server application is meant to be run with [tiangolo/meinheld-gunicorn-flask](https://hub.docker.com/r/tiangolo/meinheld-gunicorn-flask) Docker container. The main.py will return the necessary Flask instance.

## Version History

### v0.15
- Thumbnails are now beeing created at file upload
- default streaming service (stream.franconia-film.de) is now integrated
- VideoJS is implemented for the default streaming service
- UI changes such as minimizable filter list and minor enhancements

### v0.2
- Minor UI changes
- Clips can now be deleted from the Project library
- DaCast Bug Fix
- Fixed photo galleries for no Stills available
- Implemented Landing page and contact form


### v0.1
