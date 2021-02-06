# Covideo Dailies Server
This is the Server Application with is supposed to go with Viewer Apps und DIT Desktop Clients in the future. It manages the data of every film projects, exposes them to an API and has an integrated Web Application, which is for now used to manage and view Footage and Metadata.
The server application is meant to be run with [tiangolo/meinheld-gunicorn-flask](https://hub.docker.com/r/tiangolo/meinheld-gunicorn-flask) Docker container. The main.py will return the necessary Flask instance.

ENV Variables:

FLASK_APP=flaskr
FLASK_ENV=development
FLASK_DEBUG=True
MAIL_USERNAME=sdff
MAIL_PASSWORD=sdf
to send EMails from the contact form.

## First time running
- Make sure Python 3.8 is installed on your system. (check with 'python3 -v' in Terminal)
- Open Terminal and cd to project root folder. A folder named 'flaskr' must be the imediate child. 
- run ". install.sh" to init the flask app
- Open a second Terminal window and again cd to project root folder
- run ". run2.sh"
Optionally you can install Sample Footage:
- Go to 127.0.0.1:5000 in Browser -> Login and Login with DIT and 'wurst'
- Go to project and create a project with the settings of your choice. 
- Click on view to open the projet and click on upload. 
- Take all the contents from the SAMPLE FOOTAGE folder, found in the project root folder and drag them to the file upload. 

## Running
- Open Terminal and cd to project root folder. A folder named 'flaskr' must be the imediate child. 
- run ". run.sh"
- Open a second Terminal window and again cd to project root folder
- run ". run2.sh"


## Version History

### v0.3
- Show live stream connection information to DIT
- 4x4 theatre mode (only temporary until UI rework in angular)
- VideoJS live player refresh and offline fallback video
- Fixed Bug: Youtube and Inhouse Stream now possible on one page
- Show stream settings to DIT
- Import Metadata from Silverstack 7 via XML file upload. Labels can be mapped in the Project Manager
- Added Footer App
- Bugfix: DIT log in required for project manager, uploader and meta editor
- integrated Dropzone.js to prevent client side timeout at file upload
- added sort buttons for thumbnail view
- adds first still as thumbnail if no thumbnail is generated
- autoreload project library every two minutes
- seperate DIT / Admin login

### v0.2
- Minor UI changes
- Clips can now be deleted from the Project library
- DaCast Bug Fix
- Fixed photo galleries for no Stills available
- Implemented Landing page and contact form

### v0.15
- Thumbnails are now beeing created at file upload
- default streaming service (stream.franconia-film.de) is now integrated
- VideoJS is implemented for the default streaming service
- UI changes such as minimizable filter list and minor enhancements

### v0.1
