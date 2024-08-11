import { NextPage } from 'next';
import Layout from '../app/layout';
import { useState, useEffect } from 'react'



const AboutPage: NextPage = () => {
  return (
    <Layout>
      <div>
        <h1>About Us</h1>
        <p>Welcome to our About page!</p>
      </div>
    </Layout>
  );
};


export default AboutPage;