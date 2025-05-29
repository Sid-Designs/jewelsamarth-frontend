import React, { useEffect } from 'react';

const PowerBI = () => {
    useEffect(() => {
        const iframe = document.querySelector("iframe");

        if (iframe) {
            iframe.onload = () => {
                const article = document.querySelector("article");
                if (article) {
                    article.style.display = "none";
                }
            };
        }
    }, []);

    return (
        <div className='h-full w-full'>
            <iframe 
                title="project_product2" 
                width="100%" 
                height="100%" 
                src="https://app.powerbi.com/reportEmbed?reportId=adfed290-abc0-4a20-bb2a-c027c10f839b&autoAuth=true&embeddedDemo=true" 
                frameBorder="0" 
                allowFullScreen={true}
            ></iframe>
        </div>
    );
};

export default PowerBI;
