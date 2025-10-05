from ultralytics import YOLO

model = YOLO("acc_best.pt")
print(model.names)
