
Introduction
==========

Welcome to SGN iOS Document
------------------

Introduce SGN platform and describe about SGN feature

Requirements
===========

Client ID & Redirect URI
-----------------------------
Client ID (like a app id) use to identify your game with SGN server

Redirect URI is a URI, use to communicate between your app and SGN server. You must config it both on dashboard for server side and your app for client side

After your app is created, you can get that information to configure your project

![Imgur](http://i.imgur.com/7tRJL2N.png?1)

**Configure the *.plist***

1. Create a key called **MWClientID** with a string value, and add the client ID there.
2. Create a key called **MWRedirectURI** with a string value, and add the Redirect URI value that you configured on SGN Dashboard.

Facebook App on Facebook Developer
---------------------------------------------

SGN SDK uses Facebook login feature, and require Facebook app id configed in your app. To config your app to use Facebook login and other Facebook feature, please read [Facebook document](https://developers.facebook.com/docs/ios/getting-started/) for more detail. We will descibe shortly:

**Step 1**: Setup your development environment
	- OS X is required for all iOS development.
	- You need [Xcode](https://developer.apple.com/xcode/). If you don't have it, you can get it from the [App Store](http://itunes.apple.com/us/app/xcode/id497799835?ls=1&mt=12).
	- Optionally, you may want to use [Git](http://git-scm.com/).

> SGN SDK for iOS require Facebook SDK version 3.17 and above
	
**Step 2**: Install Facebook SDK for iOS
	Download the SDK and install the package by following the instruction wizard. The default install location is ~/Documents/FacebookSDK.
	
Download Facebook SDK [here](https://developers.facebook.com/resources/facebook-ios-sdk-current.pkg)
	
**Step 3**: Obtain a Facebook App ID
If you haven't already registered your app with Facebook by creating a Facebook app, you can create a new app on the [App Dashboard](https://developers.facebook.com/apps/). In the App Dashboard, select Apps > Create an app:
![Create Facebook App](https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-xpa1/t39.2178-6/851588_403264036444039_1695787132_n.png)

And fill in the information:

![Create Facebook App](https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-xpa1/t39.2178-6/851563_216692428513581_869169514_n.png)

Once your app is created, or if you already had a Facebook app, the app ID is shown at the top of the dashboard page.

![enter image description here](https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-xap1/t39.2178-6/851585_183135111881879_627295533_n.png)

> If you already have a Facebook app (and corresponding Facebook app ID) that you're using **for the same app** in another platform (for example, Android), you can use the same app ID for iOS.

Next, you need to set the Bundle Identifier and configure your Facebook application to support login from an iOS application.

Select "Settings" from the left-hand nav. Inside the settings, click on "Add Platform" and choose "iOS". Then provide your Bundle Identifier in the "Bundle ID" field and enable "Single Sign On". Don't forget to save the changes!

![enter image description here](https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-xpa1/t39.2178-6/851548_358621534281864_1471519634_n.png)

You can find or set your Bundle Identifier in Xcode in the Project tab.

![enter image description here](https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-xpa1/t39.2178-6/851582_513311175399624_1454431613_n.png)

**Step 4**: Configure your Xcode Project

Add the Facebook SDK for iOS to your project and configure your .plist file.

**Add the Facebook SDK**
The Facebook SDK for iOS is a framework that you add to your Xcode project. To add the SDK, open *~/Documents/FacebookSDK* and drag the *FacebookSDK.framework* folder into the Frameworks section of your Project Navigator.

![enter image description here](https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-xpa1/t39.2178-6/851559_474331895971007_1155327784_n.png)

Choose 'Create groups for any added folders' and deselect 'Copy items into destination group's folder (if needed)' to reference the SDK where it was installed rather than copying the SDK into your app.

![enter image description here](https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-xpa1/t39.2178-6/851576_660566167290594_1931798381_n.png)

The SDK will automatically load its framework and resource dependencies.

**Configure the *.plist***
Follow these three steps:

1. Create a key called FacebookAppID with a string value, and add the app ID there.
2. Create a key called FacebookDisplayName with a string value, and add the Display Name you configured in the App Dashboard.
3. Create an array key called URL types with a single array sub-item called URL Schemes. Give this a single item with your app ID prefixed with fb. This is used to ensure the application will receive the callback URL of the web-based OAuth flow.

The finished .plist should look something like this:

![enter image description here](https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-xap1/t39.2178-6/851559_148282688685691_1981352615_n.png)

Development Environment
-------------------------------

###Library compatibility
The SGN iOS SDK supports all iOS 5.0 and above versions. It compiles against the armv7, armv7s and arm64 architectures (+ i386 for the simulator).

###Xcode
We are using Xcode 5.1.1 to create our demo projects. You may encounter some errors if you are using a lower version of Xcode. That's why we recommend you work on the latest (non-beta) available version.

###Sample projects
We provide sample projects to help you implement our SDK.
These sample projects can be downloaded from Dashboard, or from Bitbucket.

###Download the SGN iOS SDK
The SDK can be downloaded from the SGN dashboard or from Bitbucket

Setup your project
===============

###Import the library into your project
The sample project displays the simplest way to install the SDK inside your app: Dragging & dropping the SDK into your own project.

To get started, drag the SDK onto your Frameworks group in Xcode's Project Navigator:

![Imgur](http://i.imgur.com/SLDn40a.png)

Choose 'Create groups for any added folders' and select 'Copy items into destination group's folder (if needed)' to copy sdk to your project folder

![Imgur](http://i.imgur.com/VZb3nWM.png)

The SGN iOS SDK requires additional frameworks to operate. Make sure to have them in your project.
If you fail to do so, your project will not compile and XCode will produce errors.

Navigate to the **General** tab, scroll down to **Linked Frameworks and Libraries** and then hit the "+" button.

![Imgur](http://i.imgur.com/C89a0Tl.png)

Search for and add the following frameworks:

 - Security
 - CoreTelephony

![Imgur](http://i.imgur.com/iqKysJQ.png)

When complete, it should be like this

![Imgur](http://i.imgur.com/zxbnxc5.png)

###Add linker flag
Open Build Settings of your current Target, add **-ObjC** to your **Other Linker Flags**

![Imgur](http://i.imgur.com/tEzyw55.png)

###Initialize the library
The SDK is now installed and set up. You can use the SDK from any of your implementation files by adding the SGN SDK header file:

    #import <SGNSDK/MWSGNSDK.h>

To use all feature of SGN, SDK must be initialized, call init and auto login method

    [MWSGNSDK initializationAndAutoLoginWithSuccess:^(MWUser *loggedUser) {
  
    } failure:^(NSError *error) {
            
    }];

Init method is required. If success, you will receive current user object and can use all feature below.

Link/unlink account
================

	[MWLoginHelper loginWithSuccess:^(BOOL userSwitched, MWUser *loggedUser) {
        if (userSwitched) {
            //userSwitched = YES => User changed. 
            //You should reload new charactor that mapped with new user;
        } else {
	        //userSwitched = NO => User changed.
        }
    } failure:^(NSError *error) {
        
    } userCancel:^{
        
    }];

**Handling the Response from the Facebook app**

To process the response you get from interacting with the Facebook login process, you need to override the application:openURL:sourceApplication:annotation: method in your app delegate by adding the following code:

    - (BOOL)application:(UIApplication *)application
                openURL:(NSURL *)url
      sourceApplication:(NSString *)sourceApplication
             annotation:(id)annotation {
    
            // Call FBAppCall's handleOpenURL:sourceApplication to handle Facebook app responses
            BOOL wasHandled = [FBAppCall handleOpenURL:url sourceApplication:sourceApplication];
    
            // You can add your app-specific url handling code here if needed
    
            return wasHandled;
        }

User's Profile
===========
	[MWProfileHelper showProfileWithSuccess:^{
        
    } error:^(NSError *error) {
        
    }];

Payment
=======
	[MWPaymentHelper showPaymentWithSuccess:^(MWTransactionType completeType, NSString *transactionID, NSString *amount, NSString *itemId, NSString *inAppPurchasedProductId) {
        
    } userSentSMS:^{
        
    } failure:^(NSError *error) {
        
    } userCancel:^{
        
    }];
Share Facebook
=============
	[MWFacebookHelper presentShareDialogWithLink:[NSURL URLWithString:@"http://google.com.vn"] completionBlockHandler:^(MWFBDialogResult result, NSError *error) {
        
    }];
Invite Facebook friend
==================
	[MWFacebookHelper showDefaultInviteDialogWithTitle:nil andMessage:@"Message to invite" handler:^(MWFBDialogResult result, NSArray *invitedFacebookId, NSError *error) {
        
    }];
Push Notification
==============

SSL Certificate
-----------------
Several steps are required on the [Apple Developer Member Center](https://developer.apple.com/membercenter) in order to configure push notifications.
You will need to have a valid App ID and associated SSL certificate.
The certificate will allow the SGN Server to communicate with Apple Push servers in order to send the push notifications to your application.

Generating your Certificate Request
------------------------------------------
To begin, we'll need a certificate signing request file. This will be used to authenticate the creation of the SSL certificate.
**Step 1**: Launch the Keychain Access application on your Mac. This application can be found in the folder **Applications / Utilies**.

**Step 2**: Select the menu item **Keychain Access > Certificate Assistant > Request a Certificate From a Certificate Authority...**

![Generating your Certificate Request](http://docs.appsfire.com/sdk/ios/integration-reference/img/doc/push-keychain.jpg)

**Step 3**: Enter your email address and name, then click on Continue.

![Generating your Certificate Request](http://docs.appsfire.com/sdk/ios/integration-reference/img/doc/push-certificate-request-01.jpg)

Step 4: Select Save to save the `.certSigningRequest` file to your desktop.

![enter image description here](http://docs.appsfire.com/sdk/ios/integration-reference/img/doc/push-certificate-request-02.jpg)

App ID
-------

###Creation of the App ID

You should normally have an App ID but to make sure everything is setup correctly we will cover all the phases of the creation of an App ID with the push notifications enabled.

1. Navigate to the [Apple Developer Member Center](https://developer.apple.com/membercenter) website, and select [Certificates, Identifiers & Profiles](https://developer.apple.com/account/overview.action).
2. Select [Identifiers](https://developer.apple.com/account/ios/identifiers/bundle/bundleList.action) from the iOS Apps section.
3. You will see a list of your iOS App IDs. Select the + button to register a new App Id.

![Creation of the App ID](http://docs.appsfire.com/sdk/ios/integration-reference/img/doc/push-app-id.jpg)

On the screen presented to you, you will be able to configure your App ID.

1. Enter a name for your new App ID.
2. Under **App ID Suffix** make sure to check the **Explicit App ID** radio button and enter your reversed addresses. In this example we will use com.mycompany.SGNSDKDemo.
3. Make sure to select the check-box next to **Push Notifications** under **App Services**.
4. Select **Continue** and make sure that all the values were entered correctly. Push Notifications should be enabled, and the Identifier field should match your app's Bundle Identifier (plus App ID Prefix). Select **Submit** to finalize the registration of your new App ID.

![Imgur](http://i.imgur.com/MzVphsV.jpg)

###Configuration of the App ID for Development Push Notifications

Now that you've created an App ID (or chosen an existing Explicit App ID), it's time to configure the App ID for Push Notifications.

**Step 1**: Select your newly created App ID from the list of iOS App IDs, then select **Settings**.

![Imgur](http://i.imgur.com/DyYTpjq.jpg)

**Step 2**: Under **Push Notifications** you will be able to create both a Development SSL Certificate, as well as a Production SSL Certificate. Start by selecting **Create Certificate** under **Development SSL Certificate**.

![enter image description here](http://docs.appsfire.com/sdk/ios/integration-reference/img/doc/push-app-id-cert.jpg)

**Step 3**: The next screen will show instructions for creating a Certificate Signing Request (CSR). This is the same `.certSigningRequest` file you created earlier. Select **Continue**, then select **Choose File...** and locate the `.certSigningRequest` you previously created.

Step 4: Select **Generate**. Once the certificate is ready, download the generated SSL certificate.

![Imgur](http://i.imgur.com/ydqwU0u.jpg)

> *Note that you've just enabled Push Notification for your app in development mode. Prior to releasing your application on the AppStore, you will need to repeat the previous steps but select Production Push SSL Certificate in step 2 of the section Configuration of the App ID on this same page.*

Certificate
------------

**Step 1**: Now that you have downloaded the SSL certificate, add it to your Keychain by double clicking on it.

![Imgur](http://i.imgur.com/HaHAaw4.jpg)

**Step 2**: In the keychain window locate your certificate under **My Certificates**. It should be named **Apple Development IOS Push Services**, followed by the reversed address you set earlier. Unfold the certificate and you should see the key. Select the certificate and the key then right click and finally select **Export 2 items** and save as a .p12 file.

![Imgur](http://i.imgur.com/RIMjXLL.jpg)

> You will be prompted to enter a password which will be used to protect the exported certificate. Do not enter an export password when prompted! Note that you might have to enter your OS X password to allow Keychain Access to export the certificate from your keychain.

![Certificate](http://docs.appsfire.com/sdk/ios/integration-reference/img/doc/keychain-certificate-save.jpg)

Convert your .p12 file to .pem file
----------------------------------------

Now that we have created your .p12 file, we will convert it to a .pem file.
To do so:

1. Open a terminal (Terminal can be found in **Applications / Utilies**)
2. Go to the directory where your `p.12` file is located
3. Type the the following command:

> openssl pkcs12 -in Certificates.p12 -out apple_push_notification.pem -nodes -clcerts

![Convert to pem file](http://docs.appsfire.com/sdk/ios/integration-reference/img/doc/terminal-convert.jpg)

Upload pem file to SGN dashboard
-----------------------------------------

Now that you have your SSL certificate as a .pem file you have to upload it to dashboard to allow SGN server communicate with Apple Push servers.
Unfortunately, upload feature is under contruction. So, please contact us, send us your file and we will do it for you.
Sorry for the inconvenience!

Configuring a Push Enabled iOS Application
----------------------------------------------------

We are finally ready to create our iOS application! Let's start by configuring the Xcode project settings.
We'll need to make sure the App ID are set. To do so, in the Info.plist file under the **Supporting Files** folder, modify the Bundle Identifier field to match your App ID's Bundle Identifier (In example above, it is com.mycompany.SGNSDKDemo)

![Imgur](http://i.imgur.com/QlXEs9n.jpg)

Xcode integration
---------------------

When init SDK, push notification will be registered by default and you don't need to care about it. Just a few steps are remaining in order to activate push in your project

If the registration is successful, the callback method 

`-application:didRegisterForRemoteNotificationsWithDeviceToken:` 

in the application delegate will be executed. We will need to implement this method and use it to inform SGN about this new device.

    - (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
        [[MWNotificationManager sharedInstance] didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
    }

Also, if your app is already running in foreground upon receiving a push notification, sdk need to read notification content. In order to achieve that, add the following code in the 
`-application:didReceiveRemoteNotification: method of your application delegate:`

    - (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
        [[MWNotificationManager sharedInstance] didReceiveRemoteNotification:userInfo];
    }

When app is not running, and is opened by notification, the sdk must be known.

    + (void)initialize {
        [MWNotificationManager sharedInstance];
    }

Release Notes
===========

Known Issues
===========

FAQ
===

Support
======

> Written with [StackEdit](https://stackedit.io/).
