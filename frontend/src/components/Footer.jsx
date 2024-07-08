import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {

    const currentYear = new Date().getFullYear()

    return (
        <footer>
            <Container>
                <Row>
                    <Col className='text-start py-3'>
                        <p><i><b>Created By Parth Trivedi</b></i></p>
                    </Col>
                    <Col className='text-end py-3'>
                        <p><b><i>ProShop &copy; {currentYear}</i></b></p>
                    </Col>
                </Row>
            </Container>

        </footer>
    )
}

export default Footer
