import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title: string
  description: string
}

const SEO = ({ title, description }: SEOProps) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
  </Helmet>
)

export default SEO
