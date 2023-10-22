import matplotlib.pyplot as plt
import numpy as np
import PIL
import tensorflow as tf
import os
import shutil

from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.models import Sequential

classifiers = {
    "halaman depan kelas": [
        "/home/smanti/manajemen-kelas/assets/images/76f493b8-9235-11e3-8fd0-4f8f8c9851c5_2023-10-05T23:11:26.699Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/6ee2f04e-58aa-11e3-934a-a7aa7d201672_2023-10-05T06:11:09.158Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/6ee2f04e-58aa-11e3-934a-a7aa7d201672_2023-10-18T23:41:53.681Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/9ff6c6f4-3a38-11e4-be17-ab7827d4c891_2023-10-16T23:19:26.869Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/76f493b8-9235-11e3-8fd0-4f8f8c9851c5_2023-10-05T23:11:26.699Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/76f493b8-9235-11e3-8fd0-4f8f8c9851c5_2023-10-12T23:19:41.200Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/406cf6c8-712e-11e3-b6a7-4bc5fca3eb03_2023-10-17T23:37:43.692Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/92038d7b-4ac7-4aed-8807-90177e85c542_2023-10-10T23:33:14.173Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/834576c4-6ba6-11e3-a624-7f71474504f8_2023-10-05T23:23:06.073Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/4991826e-5b4c-11e5-9073-0bb30320d078_2023-10-03T23:38:21.293Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/4991826e-5b4c-11e5-9073-0bb30320d078_2023-10-17T23:11:06.714Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/bfe61a44-20c1-40ae-8e03-5ae189d32ee8_2023-10-02T23:14:00.626Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/bfe61a44-20c1-40ae-8e03-5ae189d32ee8_2023-10-09T22:56:02.565Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/bfe61a44-20c1-40ae-8e03-5ae189d32ee8_2023-10-16T22:47:07.327Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/c4ea4cb0-7675-11e3-8c60-73479f274147_2023-10-16T23:02:46.454Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/cddf2e82-e029-447a-a078-7ddc472af353_2023-10-04T22:54:34.255Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/cddf2e82-e029-447a-a078-7ddc472af353_2023-10-18T23:44:43.861Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/e6a033d4-520b-4434-a25a-d7429c3a4978_2023-10-02T23:32:07.002Z.jpeg"
    ],
    "depan kelas": [
        "/home/smanti/manajemen-kelas/assets/images/01c3ff82-4fa2-11e3-8d0a-6fddd8c16444_2023-10-03T23:19:02.210Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/1fe62629-b16f-4de5-b8d5-536116f91e1e_2023-10-15T23:05:14.539Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/28a36d57-b296-46a4-8702-a465c95d2bc1_2023-10-05T23:44:29.310Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/35e2afea-c092-11e4-9d8c-af5932761cc1_2023-10-09T02:08:16.074Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/406cf6c8-712e-11e3-b6a7-4bc5fca3eb03_2023-10-10T23:12:41.250Z.jpeg",
    ],
    "depan lobby": [
        "/home/smanti/manajemen-kelas/assets/images/01c3ff82-4fa2-11e3-8d0a-6fddd8c16444_2023-10-10T23:10:07.240Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/406cf6c8-712e-11e3-b6a7-4bc5fca3eb03_2023-10-03T23:08:10.444Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/4991826e-5b4c-11e5-9073-0bb30320d078_2023-10-10T23:05:32.661Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/e6a033d4-520b-4434-a25a-d7429c3a4978_2023-10-09T23:13:19.495Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/f3efee74-86d8-11e4-9bf0-1be48a097e2f_2023-10-05T22:52:32.229Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/f3efee74-86d8-11e4-9bf0-1be48a097e2f_2023-10-12T22:54:39.729Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/ffdb626c-4cc6-4158-8574-7e97da41d420_2023-10-05T06:17:03.584Z.jpeg"
    ],
    "dalam kelas": [
        "/home/smanti/manajemen-kelas/assets/images/01c3ff82-4fa2-11e3-8d0a-6fddd8c16444_2023-10-17T23:06:11.663Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/1fe62629-b16f-4de5-b8d5-536116f91e1e_2023-10-09T03:36:05.906Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/04f5740c-60d6-11e3-9fbe-fb4fdce08184_2023-10-05T23:25:05.248Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/48b88556-46fc-11e3-bd04-5b26f08ce46f_2023-10-09T03:41:41.736Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/70cb0f61-4cea-41ea-a515-7f10ae84c868_2023-10-03T23:42:03.894Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/70cb0f61-4cea-41ea-a515-7f10ae84c868_2023-10-17T23:11:45.811Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/127e8ad9-176c-4f8f-b357-88521fc4a435_2023-10-01T23:04:28.785Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/8829e1d5-1905-4366-8814-3d9de05fd5f7_2023-10-17T23:40:53.699Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/92038d7b-4ac7-4aed-8807-90177e85c542_2023-10-17T23:41:32.908Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/b2c0ac5c-6a34-11e3-81a1-7f3111d076a5_2023-10-05T22:43:39.519Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/b2c0ac5c-6a34-11e3-81a1-7f3111d076a5_2023-10-12T22:38:11.175Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/be90eddc-d517-43f0-8034-69ca007fca71_2023-10-09T00:03:36.929Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/be382d5f-5d40-418b-a7bd-47058cf52e15_2023-10-04T21:27:46.589Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/be382d5f-5d40-418b-a7bd-47058cf52e15_2023-10-18T23:31:27.701Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/e72ac6a4-94bd-11e3-a948-abf0e30f8704_2023-10-05T22:31:05.978Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/e72ac6a4-94bd-11e3-a948-abf0e30f8704_2023-10-12T22:40:11.053Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/e4594dd0-649b-11e3-8498-37726d46719d_2023-10-09T22:59:53.129Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/e4594dd0-649b-11e3-8498-37726d46719d_2023-10-16T22:49:25.307Z.jpeg",
        "/home/smanti/manajemen-kelas/assets/images/f6fc25b8-69f8-11e3-8376-23738b3c9217_2023-10-05T06:07:56.140Z.jpeg"
    ],
    "depan ruangguru": [
        "/home/smanti/manajemen-kelas/assets/images/a46ff5f2-595b-11e3-90f8-ab41eaf2016a_2023-10-17T00:18:48.286Z.jpeg"
    ]
}

def importImagesByCategory():
    keys = list(classifiers.keys())

    if os.path.exists("images") == False:
        os.mkdir("images")
    for k in keys:
        if os.path.exists(os.path.join("images", k)) == False:
            os.mkdir(os.path.join("images", k))
        
        files = classifiers[k]
        for file in files:
            shutil.copyfile(file, os.path.join("images", k, os.path.basename(file)))


importImagesByCategory()

# train
batch_size = 32
img_height = 360
img_width = 360

train_ds = tf.keras.utils.image_dataset_from_directory("images", validation_split=0.2, subset="training", seed=123, image_size=(img_height, img_width), batch_size=batch_size)
val_ds = tf.keras.utils.image_dataset_from_directory("images",validation_split=0.2, subset="validation", seed=123, image_size=(img_height, img_width), batch_size=batch_size)

class_names = train_ds.class_names
print("Class names: ", class_names)

AUTOTUNE = tf.data.AUTOTUNE

train_ds = train_ds.cache().shuffle(1000).prefetch(buffer_size=AUTOTUNE)
val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)

normalization_layer = layers.Rescaling(1./255)
normalized_ds = train_ds.map(lambda x, y: (normalization_layer(x), y))
image_batch, labels_batch = next(iter(normalized_ds))
first_image = image_batch[0]

num_classes = len(class_names)

data_augmentation = keras.Sequential(
  [
    layers.RandomFlip("horizontal",
                      input_shape=(img_height,
                                  img_width,
                                  3)),
    layers.RandomRotation(0.1),
    layers.RandomZoom(0.1),
  ]
)

model = Sequential([
  data_augmentation,
  layers.Rescaling(1./255),
  layers.Conv2D(16, 3, padding='same', activation='relu'),
  layers.MaxPooling2D(),
  layers.Conv2D(32, 3, padding='same', activation='relu'),
  layers.MaxPooling2D(),
  layers.Conv2D(64, 3, padding='same', activation='relu'),
  layers.MaxPooling2D(),
  layers.Dropout(0.2),
  layers.Flatten(),
  layers.Dense(128, activation='relu'),
  layers.Dense(num_classes, name="outputs")
])

model.compile(optimizer='adam',
              loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
              metrics=['accuracy'])

epochs = 30
history = model.fit(
  train_ds,
  validation_data=val_ds,
  epochs=epochs
)

acc = history.history['accuracy']
val_acc = history.history['val_accuracy']

loss = history.history['loss']
val_loss = history.history['val_loss']

epochs_range = range(epochs)

plt.figure(figsize=(8, 8))
plt.subplot(1, 2, 1)
plt.plot(epochs_range, acc, label='Training Accuracy')
plt.plot(epochs_range, val_acc, label='Validation Accuracy')
plt.legend(loc='lower right')
plt.title('Training and Validation Accuracy')

plt.subplot(1, 2, 2)
plt.plot(epochs_range, loss, label='Training Loss')
plt.plot(epochs_range, val_loss, label='Validation Loss')
plt.legend(loc='upper right')
plt.title('Training and Validation Loss')

plt.savefig("train.png")

# test
testImgPath = tf.keras.utils.get_file("Dalam_Kelas", "https://i0.wp.com/saim.sch.id/wp-content/uploads/2020/08/IMG_000000_000000.jpg?fit=1200%2C900&ssl=1")
testImg = tf.keras.utils.load_img(testImgPath, target_size=(img_height, img_width))

img_array = tf.keras.utils.img_to_array(testImg)
img_array = tf.expand_dims(img_array, 0) 

predictions = model.predict(img_array)
score = tf.nn.softmax(predictions[0])

print(
    "This image most likely belongs to {} with a {:.2f} percent confidence."
    .format(class_names[np.argmax(score)], 100 * np.max(score))
)

# save
model.save("model1.keras")
model.save("model1.h5")