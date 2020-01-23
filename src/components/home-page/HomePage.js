import React from 'react';

const HomePage = () => {
    return (
        <div style={{ margin: '20px'}}>
            <div >
                <h1>Welcome to Capsules Space</h1>
                <p>Using this App, content creators can easily:</p>
                <ul>
                    <li>Upload content to a distributed file storage network (IPFS)</li> 
                    <li>Digitally sign the content creating a Capsule</li>
                    <li>Register the capsule in the Ethereum Blockchain</li>
                    <li>Share the Capsule URL with others to they can visualize it and check the creator's signature</li> 
                </ul>
            </div>
            <h1>What is a Capsule</h1>
            <p>A Capsule simply encapsulates ...</p>
            <ul>
                <li>A reference (or link) to the content</li>
                <li>The digital signature of the content creator</li>
            </ul>
            <h1>Why should I create Capsules?</h1>
            <ul>
                <li>Content consumers know exactly who created the content</li>
                <li>The signature in a Capsule ensures that the content was not modified in any form</li>
                <li>Capsules reinforces a trust relationship between creator and consumers</li>
            </ul>
            <h1>Before you start</h1>
            <ul>
                <li>Watch our quick demo video</li>
                <li>You need to have the uPort app in your mobile device</li>
                <li>You need to create an uPort ID (remember to backup your secret seed)</li>
                <li>If you want to register the capsule in the Blockchain, you will need to have the Metamask brwoser extension</li>
            </ul>
            <h1>Your first Capsule</h1>
            <ul>
                <li>Go to the page Launch Capsule</li>
                <li>Scan the QR code with your uPort App</li>
                <li>After logged in, choose a title to the and select the content file</li>
                <li>Click on the button Upload to IPFS</li>
                <li>Your content is now stored in the IPFS network</li>
                <li>Click on the button Sign the Content to sign the content with your uPort app</li>
                <li>Upload the Capsule to IPFS</li>
                <li>Register the Capsule on the Ethereum Blockchain</li>
           </ul>
            <h1>Our tech stack</h1>
            <ul>
                <li>We use IPFS (Interplanetary File System) as our default storage for content</li>
                <li>We use uPort App and libraries as our default SSI providers</li>
                <li>We use Ethereum smart contracts as Capsule registries></li>
            </ul>           
        </div>
    );
}

export default HomePage;