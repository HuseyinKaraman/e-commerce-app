import React from "react";
import { Checkbox, Col, Rate, Row } from "antd";

const RatingFilterComponent = ({ setRatingsFromFilter }) => {
    return (
        <div className="flex flex-col">
            <p className="font-bold mb-1">Rating</p>
            <Checkbox.Group>
                <Row>
                    {Array.from({ length: 5 }).map((_, idx) => (
                        <Col span={24} key={idx}>
                            <Checkbox
                                value={5 - idx}
                                id={`check-api-${idx}`}
                                onChange={(e) =>
                                    setRatingsFromFilter((items) => {
                                        return { ...items, [5 - idx]: e.target.checked };
                                    })
                                }
                            >
                                <Rate disabled defaultValue={5 - idx} />
                            </Checkbox>
                        </Col>
                    ))}
                </Row>
            </Checkbox.Group>
        </div>
    );
};

export default RatingFilterComponent;
