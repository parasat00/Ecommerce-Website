## How to run the project

### Check if python and pip installed
Type these commands in terminal/Powershell/command line
```
python -–version
pip --version
```
Alternatively you may have python3 and pip3. So if you receive an error in terminal. Try to use the same commands but with python3 and/or pip3

#### What if you dont have python or pip installed in your computer
Skip this subsection if you have both installed.
+ If you don't have both of them on your computer, you can download and install python [here](https://www.python.org/downloads/). During the installation don't forget to put a checkmark on pip. It will automatically install pip on your computer.
+ If you have only python installed and not pip. You can follow this [guide](https://www.geeksforgeeks.org/how-to-install-pip-on-windows/)

### Install and create virtual environment
To install virtualenv, write this command on your terminal
```
pip install virtualenv
```
cd to project location and create virtualenv, I will name it venv
```
virtualenv venv
python -m virtualenv venv (if not working try this one)
```
run venv and install dependencies in requirements.txt
```
venv\Scripts\activate
pip install -r requirements.txt
```

### Run the project
```
python manage.py runserver
```
Open the browser and go to http://127.0.0.1:8000/
