<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Full Page Image</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    html, body {
      height: 100%;
      overflow: hidden;
    }
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #000; /* Optional: Background color while the image loads */
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover; /* Ensures the image covers the viewport without distortion */
    }
  </style>
</head>
<body>
  <img src="https://appreciatewealth.com/blog/wp-content/uploads/2023/02/Mutual-Funds-1024x576.png" 
       alt="Mutual Funds">
</body>
</html>
