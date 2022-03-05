# Load libraries
from flask import Flask, render_template, url_for, jsonify, request, redirect
from flask_cors import CORS


import torch
from torch import nn
from torch import optim
import torch.nn.functional as F
from torchvision import datasets, transforms, models
from PIL import Image
from torch.autograd import Variable

# instantiate flask 
app = Flask(__name__)
CORS(app)

test_transforms = transforms.Compose([transforms.Resize((224,224)),
                                      transforms.ToTensor(),
                                      #transforms.Normalize([0.485, 0.456, 0.406],
                                      #                     [0.229, 0.224, 0.225])
                                     ])


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model=torch.load('Potterymodel.pth')
model.eval()

@app.route('/predict', methods=['GET'])
def hello():
    return 'Hello World!'
@app.route('/predict', methods=['POST'])
def predict_img():
        classes = ['Bowl','Jar','Juglet','Jug']
        data = {"predict_result": False}
        ######predict image#####
        file = request.files['file']
        img=Image.open(file)
        index = predict_image(img)
        print(classes[index])
        return classes[index]
        




def predict_image(image):
    image_tensor = test_transforms(image).float()
    image_tensor = image_tensor.unsqueeze_(0)
    input = Variable(image_tensor)
    input = input.to(device)
    output = model(input)
    #print(output)
    index = output.data.cpu().numpy().argmax()
    return index  



if __name__ == '__main__':
    app.run(host='0.0.0.0', port='8989', debug=True)
