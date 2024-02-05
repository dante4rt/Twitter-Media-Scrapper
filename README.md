# Twitter Media Scrapper

This Node.js script automates the process of downloading media (currently images and gifs) from specified Twitter posts. It utilizes Puppeteer with a Stealth Plugin to navigate and render Twitter pages, Cheerio for parsing HTML and selecting media elements, Axios for handling downloads, and provides feedback with colorful console output.

## Features

- Automates downloading of images and gifs from Twitter posts.
- Stealth browsing with Puppeteer to mimic a real user session.
- Image selection with Cheerio for efficient parsing.
- Direct image downloading into a specified folder using Axios.
- Colorful console output for enhanced user interaction.

## Prerequisites

Ensure you have Node.js installed on your system to use this script. You can download Node.js from the [official website](https://nodejs.org/).

## Installation

### Clone the Repository

First, clone the `Twitter-Media-Scrapper` repository to your local machine:

```sh
git clone https://github.com/dante4rt/Twitter-Media-Scrapper.git
cd Twitter-Media-Scrapper
```

### Install Dependencies

Install the necessary dependencies by running the following command in your terminal:

```sh
npm install
```

## Usage

To start the script, execute:

```sh
node main.js
```

Follow the prompts in your terminal:

1. Enter the full URL of the Twitter post from which you want to download images.
2. The script will then process the page and download all images marked with `alt="Image"` into the `downloads` folder.

## Customization

- Modify the `downloadFolder` variable in the script to change the destination folder for the downloaded images.
- The script can be further customized or extended to support downloading other types of media, such as videos.

## Disclaimer

This script is provided for educational and personal use. Always respect Twitter's Terms of Service, and ensure you have the right to download and use the content.

## Contributing

Contributions to enhance the functionality of this script, including adding support for video downloads or improving efficiency, are welcome. Please feel free to fork the repository and submit pull requests.
