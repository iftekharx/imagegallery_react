import React, { useState } from "react";
import {
  Button,
  Grid,
  IconButton,
  Paper,
  Dialog,
  DialogContent,
  CssBaseline,
  Card,
  Container,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const ImageTypes = "IMAGE";

const imageStyle = {
  width: "100%",
  height: "200px",
  objectFit: "contain",
  transition: "opacity 0.3s, height 0.3s, transform 0.3s",
  opacity: 1,
};

const featuredImageStyle = {
  width: "100%",
  height: "300px",
  objectFit: "cover",
  transition: "opacity 0.3s, height 0.3s, transform 0.3s",
  opacity: 1,
};

const imageContainerStyle = {
  padding: "4px",
  transition: "opacity 0.3s, height 0.3s, transform 0.3s",
};

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const bodyLightBackgroundColor = {
  backgroundColor: "#fff",
  transition: "background-color 0.3s",
};

const bodyDarkBackgroundColor = {
  backgroundColor: "#222",
  transition: "background-color 0.3s",
};

function ImageGallery() {
  const [images, setImages] = useState([
    { id: 1, url: "images/image-1.webp", isFeatured: true },
    { id: 2, url: "images/image-2.webp", isFeatured: false },
    { id: 3, url: "images/image-3.webp", isFeatured: false },
    { id: 4, url: "images/image-4.webp", isFeatured: false },
    { id: 5, url: "images/image-5.webp", isFeatured: false },
    { id: 6, url: "images/image-6.webp", isFeatured: false },
    { id: 7, url: "images/image-7.webp", isFeatured: false },
    { id: 8, url: "images/image-8.webp", isFeatured: false },
    { id: 9, url: "images/image-9.webp", isFeatured: false },
    { id: 10, url: "images/image-10.jpeg", isFeatured: false },
    { id: 11, url: "images/image-11.jpeg", isFeatured: false },
  ]);

  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentTheme, setCurrentTheme] = useState(lightTheme);

  const toggleTheme = () => {
    setCurrentTheme(currentTheme === lightTheme ? darkTheme : lightTheme);
  };

  const toggleFeatured = () => {
    const updatedImages = [...images];
    updatedImages[0] = { ...updatedImages[0], isFeatured: true }; // Set the left-most image as featured
    setImages(updatedImages);
  };

  const deleteImages = () => {
    setImages((prevImages) =>
      prevImages.filter((image) => !selectedImages.includes(image.id))
    );
    setSelectedImages([]);
  };

  const reorderImages = (dragIndex, hoverIndex) => {
    const updatedImages = [...images];
    const [draggedImage] = updatedImages.splice(dragIndex, 1);
    updatedImages.splice(hoverIndex, 0, draggedImage);

    // Make sure the left-most image is always featured
    updatedImages[0] = { ...updatedImages[0], isFeatured: true };

    setImages(updatedImages);
  };

  const closeImageDialog = () => {
    setSelectedImage(null);
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <DndProvider backend={HTML5Backend}>
        <CssBaseline />
        <div
          style={
            currentTheme === lightTheme
              ? bodyLightBackgroundColor
              : bodyDarkBackgroundColor
          }
        >
          <Container maxWidth="lg">
            <Typography textAlign={"left"} variant="h1">
              Gallery
            </Typography>
            <Grid container spacing={2} justifyContent={"center"}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={deleteImages}
                  disabled={selectedImages.length === 0}
                >
                  Delete Selected
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} justifyContent={"center"}>
                <Button variant="contained" onClick={toggleTheme}>
                  {currentTheme === lightTheme
                    ? "Switch to Dark Theme"
                    : "Switch to Light Theme"}
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              {images.map((image, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
                  <DraggableImage
                    image={image}
                    index={index}
                    reorderImages={reorderImages}
                    setSelectedImage={setSelectedImage}
                    selectedImages={selectedImages}
                    setSelectedImages={setSelectedImages}
                    toggleFeatured={toggleFeatured}
                    isLeftMost={index === 0} // Pass whether this is the left-most image
                  />
                </Grid>
              ))}
            </Grid>
          </Container>
        </div>

        {/* <div>
          <Paper elevation={3} style={{ cursor: "pointer" }}>
            <img
              src={images[0].url} // Display the left-most image as featured
              alt={`Featured Image ${images[0].id}`}
              style={featuredImageStyle}
            />
          </Paper>
        </div> */}
        <Dialog open={selectedImage !== null} onClose={closeImageDialog}>
          <DialogContent>
            {selectedImage ? (
              <img
                src={selectedImage.url}
                alt={`Image ${selectedImage.id}`}
                style={
                  selectedImage.isFeatured ? featuredImageStyle : imageStyle
                }
              />
            ) : null}
          </DialogContent>
        </Dialog>
      </DndProvider>
    </ThemeProvider>
  );
}

const DraggableImage = ({
  image,
  index,
  reorderImages,
  setSelectedImage,
  isLeftMost,
  selectedImages,
  setSelectedImages,
  toggleFeatured,
}) => {
  const [, drag] = useDrag({
    type: ImageTypes,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ImageTypes,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        reorderImages(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => drag(drop(node))} style={imageContainerStyle}>
      <Paper elevation={3} style={{ cursor: "pointer" }}>
        <img
          src={image.url}
          alt={`Image ${image.id}`}
          style={isLeftMost ? featuredImageStyle : imageStyle} // Apply the featured style to the left-most image
          onClick={() => setSelectedImage(image)}
        />
        <div>
          <IconButton onClick={() => toggleFeatured()}>
            <StarIcon color={isLeftMost ? "primary" : "action"} />
          </IconButton>
          <input
            type="checkbox"
            checked={selectedImages.includes(image.id)}
            onChange={() => {
              if (selectedImages.includes(image.id)) {
                setSelectedImages(
                  selectedImages.filter((id) => id !== image.id)
                );
              } else {
                setSelectedImages([...selectedImages, image.id]);
              }
            }}
          />
        </div>
      </Paper>
    </div>
  );
};

export default ImageGallery;
