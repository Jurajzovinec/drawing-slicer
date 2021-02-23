# Drawing Slicer !
*************************************************
## APPLICATION URL https://drawing-slicer.herokuapp.com/
*************************************************
Drawing slicer is application developed mostly for DIY hobbiest who are interested in printing huge drawing formats without necessity of owning large scale printer. Drawing slicer will slice your standard ISO drawing into smaller drawings of your choice (A4 is the most favourite one).

## Idea ?

I came up with this idea when I needed to print template from my giant surfskate. Due to pandemic I was not able to do so, so I developed short python script which will cut my A0 design into A4 format. 

1. Drawing created in CAD

<p align="center">
  <img src="public/README--Drawing.png" />
</p>

2. Sliced drawing with Drawing-Slicer and merged with tape

<p align="center">
  <img src="public/README--SlicedDrawing.png" />
</p>

3. Giant surfskate (cut based on template from step 2)

<p align="center">
  <img src="public/README--GiantSurfskate.png" />
</p>

## Backend ?

Core of the backend is based on NodeJs application written in typescript. Backend however uses python microservices, in order to handle reading and cutting the sliced pdf file. Also algorithmic part of slicing is done by python microservices. Users pdf file is handled with AWS S3 bucket storage system, whose data are cleared with every succesful download.

## Frontend ? 

Frontend is based on React framework and as backend, also frontend is written in typescript. User actions are dynamically driven by use-state hooks. CSS naming classes uses BEM structure convention.

<p align="center">
  <img src="public/README--FrontendDisplay.png" />
</p>

## Initialize pythonServices virtual environment (Windows)

1. Create python venv in this folder with *python -m venv python_modules* command
2. Activate venv with >*. python_modules\Scripts\activate* command
3. Install external packages with *pip install -r requirements.txt* command
4. Set path to interpreter at config.js file

Alternatively put this sequence into cmd.
python -m venv python_modules && python_modules\Scripts\activate && pip install -r requirements.txt