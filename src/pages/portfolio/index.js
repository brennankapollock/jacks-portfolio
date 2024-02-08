import React, { useEffect, useState } from "react";
import axios from "axios";

import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { meta } from "../../content_option";

export const Portfolio = () => {
  const videos = [
    "https://www.youtube.com/watch?v=phQxK5u8IEs",
    "https://www.youtube.com/watch?v=c3Y98Iit9QY",
    "https://www.youtube.com/watch?v=GJZz2TSBS7Y",
    "https://www.youtube.com/watch?v=bMlJKBXU1v4",
    "https://www.youtube.com/watch?v=8lgH44Nh69c",
    "https://www.youtube.com/watch?v=Y0l5aLPVmRU",
    "https://www.youtube.com/watch?v=UgLKK_l8V7o",
    "https://www.youtube.com/watch?app=desktop&v=EvpJn4z4RE4",
    // Add more video URLs as needed
  ];

  const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;

  const [videoDetails, setVideoDetails] = useState([]);
  const [portfolioItems, setPortfolioItems] = useState([]);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      const requests = videos.map((videoUrl) => {
        const videoId = new URLSearchParams(new URL(videoUrl).search).get("v");
        return axios.get("https://www.googleapis.com/youtube/v3/videos", {
          params: {
            part: "snippet",
            id: videoId,
            key: apiKey,
          },
        });
      });

      try {
        const responses = await axios.all(requests);
        const details = responses.map(
          (response) => response.data.items[0].snippet
        );
        setVideoDetails(details);
      } catch (error) {
        console.error("Error making API requests:", error);
      }
    };

    fetchVideoDetails();
  }, []);

  useEffect(() => {
    const portfolioItems = videoDetails.map((video, index) => {
      console.log("Video Object:", video);

      return {
        img: video.thumbnails.high.url, // You can choose the thumbnail size you prefer
        description: video.title,
        link: videos[index],
      };
    });
    setPortfolioItems(portfolioItems);
  }, [videoDetails]);

  console.log(portfolioItems);

  return (
    <HelmetProvider>
      <Container className="About-header">
        <Helmet>
          <meta charSet="utf-8" />
          <title> Portfolio | {meta.title} </title>{" "}
          <meta name="description" content={meta.description} />
        </Helmet>
        <Row className="mb-5 mt-3 pt-md-3">
          <Col lg="8">
            <h1 className="display-4 mb-4"> Portfolio </h1>{" "}
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>
        <div className="mb-5 po_items_ho">
          {portfolioItems.map((data, i) => {
            return (
              <div key={i} className="po_item">
                <img src={data.img} alt="" />
                <div className="content">
                  <p>{data.description}</p>
                  <a href={data.link}>view project</a>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </HelmetProvider>
  );
};
