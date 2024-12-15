# LePetiteAMusixBox
 A music (box) player built using React Native/Expo.

> [!IMPORTANT]
> The application is under going refactoring with many breaking change. Since version 0.0.5, The app will check for backend service version ensure compatibility

## About:
A simple music queue play back application. rely on self deploy backend service.

**More detail construction will come soon**

## Connect to a service:
The app allow user to connect to a domain or address of a LPAMB backend service.<br>
For more information on hosting a service yourself, visit [LPAMB Backend Service](https://github.com/baole444/LPAMB-Backend-Service) for more information.

Server IP is store in a single length async storage key, the test app provided a screen call  for you to try this out.

> [!NOTE]
> 1. Valid ip look like:
>    - `http://example-domain.xyz:1234`
>    - `https://example-domain.xyz`
>    - `example-domain.xyz`
>    - `example-domain.xyz/route/route/.../route`

## Known issues:
- Beside concern about power efficiency and the control is a bit janky, this build is more stable.
- This build also paused background music playing and enqueue implement due to the complexity of the issue it is facing.