const app = require('express')()
const path = require('path')
const shortid = require('shortid')
const Razorpay = require('razorpay')
const bodyParser = require('body-parser')

const hostname = '0.0.0.0'
const port = 3000;

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});
app.use(bodyParser.json())

const razorpay = new Razorpay({
	key_id: 'jansdjjandjsas',
	key_secret: 'kasdknsakd'
})

app.get('/logo.svg', (req, res) => {
	res.sendFile(path.join(__dirname, 'logo.svg'))
})

app.post('/verification', (req, res) => {
	// do a validation
	//TODO: change secret
	const secret = '123456'

	console.log(req.body)

	const crypto = require('crypto')

	const shasum = crypto.createHmac('sha256', secret)
	shasum.update(JSON.stringify(req.body))
	const digest = shasum.digest('hex')

	// if (digest === req.headers['x-razorpay-signature']) {
	// 	console.log('request is legit')
	// 	// process it
	// 	require('fs').writeFileSync('payment1.json', JSON.stringify(req.body, null, 4))
	// } else {
	// 	// pass it
	// }
	res.json({ status: 'ok' })
})

app.post('/razorpay', async (req, res) => {
	const payment_capture = 1
	const amount = 1
	const currency = 'INR'

	const options = {
		amount: amount * 100,
		currency,
		receipt: shortid.generate(),
		payment_capture
	}

	try {
		const response = await razorpay.orders.create(options)
		res.json({
			id: response.id,
			currency: response.currency,
			amount: response.amount
		})
	} catch (error) {
		console.log(error)
	}
})

app.listen(port, hostname, () => {
	console.log('Listening on 3000')
})