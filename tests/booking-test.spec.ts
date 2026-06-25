import {test, expect} from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config()
let token: string
let bookingId: number

test.beforeAll(async ({ request }) => {

    const authResponse = await request.post('/auth', {
        data: {
            username: process.env.BOOKER_USERNAME,
            password: process.env.BOOKER_PASSWORD
        }
    })
    const authBody = await authResponse.json()
    token = authBody.token

    const bookingResponse = await request.post('/booking', {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        data: {
            firstname: 'Jeff',
            lastname: 'Bezos',
            totalprice: 1000000000,
            depositpaid: true,
            bookingdates: {
                checkin: '2020-06-06',
                checkout: '2026-12-12'
            },
            additionalneeds: "Better margins"
        }
    })
    const bookingBody = await bookingResponse.json()
    bookingId = bookingBody.bookingid
})
test('Should return all bookings', async ({request}) =>
{
    const response = await request.get('/booking')
    const responseBody = await response.json()
    expect(responseBody[0]).toHaveProperty('bookingid')
})
test('should return the details for a specific booking', async ({request}) =>
{
    const response = await request.get(`/booking/${bookingId}`)
    const responseBody = await response.json()
    expect(responseBody).toHaveProperty('firstname')
    expect(responseBody.lastname).toBe('Bezos')
})
