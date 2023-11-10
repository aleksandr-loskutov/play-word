import { Avatar, Card, Carousel, Col, Row, Space } from 'antd';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import createCn from '../../../../utils/create-cn';
import type { Collection, AvatarSrcs } from '../../../../types/collection';
import './style.css';
import PageLoader from '../../../../components/page-loader';
import createImageFromInitials from '../../../../utils/image-from-string';
import chunkArray from '../../../../utils/chunk-array';

const cn = createCn('collection-carousel');

type CollectionCarouselProps = {
  collections: Collection[];
};

function CollectionCarousel({
  collections,
}: CollectionCarouselProps): React.ReactElement {
  const avatarSrcs = useMemo<AvatarSrcs>(
    () =>
      collections.reduce((acc: AvatarSrcs, collection) => {
        acc[collection.id] = createImageFromInitials(collection.name, 100);
        return acc;
      }, {}),
    [collections]
  );

  const chunkedCollections = useMemo(
    () => chunkArray(collections, 2),
    [collections]
  );

  if (collections.length === 0) {
    return <PageLoader />;
  }

  return (
    <Carousel dots={false} infinite autoplay className={cn('')}>
      {chunkedCollections.map((chunk, index) => (
        <Row
          key={`${index + chunk[0].id}`}
          justify="center"
          align="middle"
          className={cn('slide')}
          gutter={[15, 15]}>
          {chunk.map((collection) => (
            <Col
              key={collection.id}
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 8 }}>
              <Link
                to={`/collections/${collection.id}`}
                style={{ textDecoration: 'none' }}>
                <div className={cn('box')}>
                  <Card className={cn('card')} bordered>
                    <Space direction="vertical" align="center" size={1}>
                      <span className={cn('card-name')}>{collection.name}</span>
                      <Avatar
                        shape="square"
                        className={cn('card-image')}
                        src={avatarSrcs[collection.id]}
                      />
                      <span className={cn('card-description')}>
                        {collection.description || 'нет описания'}
                      </span>
                      <span className={cn('card-words-count')}>
                        Слов: {collection.words.length || 0}
                      </span>
                    </Space>
                  </Card>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      ))}
    </Carousel>
  );
}

export default CollectionCarousel;
