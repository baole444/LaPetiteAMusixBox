import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Canvas, Image as SkiaImage, useImage } from '@shopify/react-native-skia';

/**
 * A React component to load and display an image using Skia.
 * Use to load Image from source, fallback when failed.
 *
 * @param {number} src - The source of the image to load. If it's a string, it's resolved using `require`.
 * @param {number} [scale=1] - (Optional) The scaling factor for the image dimensions.
 * @param {string|number} [fallback] - (Optional) A fallback image to display if the main image fails to load. Defaults to a broken image icon.
 * @param {boolean} [isUrl] - Mark the source as an Url object and load the image using skia useImage url method. By default it is false, which use local image static assets. (not fully implemented yet)
 * @returns {JSX.Element} The rendered image component or a loading indicator.
 */

const Image_reload = ({src, scale = 1, fallback = require('./assets/texture/file_broken.png')}, isUrl = false) => {
  const img = useImage(src);
  const fallbackImg = useImage(fallback);
  const [imgLoad, setImgLoad] = useState(false);
  const [imgSize, setImgSize] = useState({w: 0, h: 0});

  useEffect(() => {
    if(img) {
      //console.log('Image loaded.');
      const w = img.width() * (scale || 1);
      const h = img.height() * (scale || 1);
      //console.log('Dimension: ', {w, h});
      setImgSize({w, h});
      setImgLoad(true);
    } else if (fallbackImg) {
      //console.log('Failed to load image, falling back.')
      const w = fallbackImg.width();
      const h = fallbackImg.height();
      //console.log('Dimension: ', {w, h});
      setImgSize({w, h});
      setImgLoad(true);
    } else {
      //console.log('Image failed to load.')
      setImgLoad(false);
    }
  }, [img, fallbackImg, scale]);

  return(
    <View style={{ alignItems: 'center'}}>
      {imgLoad ? (
          <Canvas style={{width: imgSize.w, height: imgSize.h}}>
            <SkiaImage 
              image ={img || fallbackImg} 
              x={0} 
              y={0} 
              width={imgSize.w} 
              height={imgSize.h} 
              fit="contain" 
              />
          </Canvas>
      ): (<ActivityIndicator size='large' color="white"/>)}

    </View>
  );
};

export default Image_reload;    
