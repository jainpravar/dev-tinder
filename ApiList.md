# apiList for dev tinder

## authRouter
- post  /signup
- post  /login
- post  /logout

## userRouter
- get  /user/feed
- get  /user/requests/recived
- post /user/connections

## profileRouter
- get  /profile/view
- patch /profile/edit
- patch /profile/password

## connectionRouter
- post /connection/review/accept/:requestId
- post /connection/review/ignored/:requestId
- post /connection/send/intrested/:userId
- post /connection/send/rejected/:userId

- accepted | rejected | interested | rejected