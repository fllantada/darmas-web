import { useEffect } from "react";
import { useMap } from "react-map-gl";

interface IProps {
  imageUrl: string;
  imageId: string;
}

export default function LayerIcon({ imageUrl, imageId }: IProps): JSX.Element {
  const map = useMap();

  useEffect(() => {
    if (map.current && imageUrl && !map.current.hasImage(imageId)) {
      map.current.loadImage(imageUrl, (error, image) => {
        if (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        } else {
          if (image && map.current && !map.current.hasImage(imageId)) {
            map.current.addImage(imageId, image);
          }
        }
      });
    }
  }, [map, imageUrl, imageId]);

  return <></>;
}
