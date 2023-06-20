# web-push-personal-tokens

This is a command line tool to generate credentials that you can use to send a push notification using the [web push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API). This tool is intended for developers who want to generate tokens for sending notifications to themselves (like a ["personal access token"](https://en.wikipedia.org/wiki/Personal_access_token)).

## Usage

```shell
go install github.com/saranrapjs/web-push-personal-tokens
web-push-personal-tokens --subject "example@example.com" --test=true
```

This will output a JSON that looks something like this:

```json
{
    "privatekey": "<VAPID_PRIVATE_KEY>",
    "publickey": "<VAPID_PUBLIC_KEY>",
    "subject": "example@example.com",
    "subscription":
    {
        "endpoint": "https://web.push.apple.com/<PRIVATE_CAPABILITY_URL>",
        "keys":
        {
            "auth": "<SUBSCRIPTION_SECRET>",
            "p256dh": "<SUBSCRIPTION_PUBLIC_KEY>"
        }
    }
}
```

## How does it work

This tool:
- generates a [VAPID](https://datatracker.ietf.org/doc/html/rfc8292) public/private keypair, using [SherClockHolmes/webpush-go](https://github.com/SherClockHolmes/webpush-go)
- spins up a temporary server with a service worker that will prompt you to subscribe to web push notifications
- dumps the result (the VAPID tokens + the subscription capability URL and tokens) to stdout as a JSON object. This JSON is secret: treat it with care!

The push notifications expected by the service worker registered using this tool are "self-contained": they expect all the salient details of the push notification to be set within the web push message payload. These are the current fields supported/required:

```typescript
type WebPushMessage = {
	title: String;
	body: String;
	url: String;
}
```

But this tool doesn't yet support the full fields in the [Web Notification API](https://developer.mozilla.org/en-US/docs/Web/API/notification), mostly because neither does Safari at this time. It also doesn't work on iOS devices (but should work on Safari for Mac), both because there's no way to run this tool, but also because Apple restricts push subscriptions their to websites installed on the homescreen.
