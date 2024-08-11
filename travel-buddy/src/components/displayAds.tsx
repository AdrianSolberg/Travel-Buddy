import React, { useState, useEffect } from 'react';
import { ref, listAll, getStorage, getDownloadURL } from "firebase/storage";
import '../styles/displayAds.css';
import { deleteObject } from "firebase/storage";
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


interface displayAdsInterface {
    admin: boolean;
}

const DisplayAds: React.FC<displayAdsInterface> = ({admin}) => {
    const [urls, setUrls] = useState<string[]>([]);

    useEffect(() => {
        const storage = getStorage();
        const listRef = ref(storage, 'files/');
        listAll(listRef)
            .then((res) => {
                const promises = res.items.map((itemRef) =>
                    getDownloadURL(itemRef).catch((error) => {
                        console.log(error);
                        return '';
                    })
                );
                Promise.all(promises)
                    .then((urls) => setUrls(urls.filter(url => url !== '')))
                    .catch((error) => console.log(error));
            })
            .catch((error) => console.log(error));
    }, []);

    const deleteAd = (url: string) => {
        const storage = getStorage();
        const fileRef = ref(storage, url);

        deleteObject(fileRef)
            .then(() => {
                console.log("File deleted successfully");
                // Then remove the URL from the state
                setUrls(prevUrls => prevUrls.filter(prevUrl => prevUrl !== url));
            })
            .catch((error) => {
                console.error("Error deleting file: ", error);
            });
    };
    const reversedUrls = urls.slice().reverse();
    return (
        <div id="adColumn">
            {reversedUrls.map((url, index) => (
                <div id ='delete' key={index}>
                    <img src={url} alt={`File ${index + 1}`} />
                    {admin && <button onClick={() => deleteAd(url)}>
                        <FontAwesomeIcon id='icon' className='not-blur' icon={faTrashCan}/>
                    </button>}
                </div>
            ))}
        </div>
    );
};

export default DisplayAds;
