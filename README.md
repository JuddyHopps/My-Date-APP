# DokiCupid  (°◡° ♡)

[See it Live](https://dokicupid.herokuapp.com/)

Welcome to DokiCupid, a dating app designed for anime characters!

DokiCupid is a clone of the popular dating site OkCupid. 
This project features user profiles, matchmaking, filtered search, and instant-messaging between users. 

This application utilizes Rails and Postgres on the back-end, and React/Redux to manage the front-end. 


![alt text](https://dokicupid-seeds.s3-us-west-1.amazonaws.com/splash.png)



## Homepage (Doubletake)
After logging in, users are greeted with the doubletake page which displays profile previews for users that the current user has not yet matched with. Users can see their match percentage with each displayed user and have the option to visit that user's profile. 

![alt text](https://dokicupid-seeds.s3-us-west-1.amazonaws.com/homepage_2.png)




## Explore and Search
The explore page gives previews of all user profiles for users who are not yet matched with the current user, along with the distance from and compatibility rating with each user. 

The search page allows a user to filter prospective matches by tags including specific personality traits, gender identification, and what the other user is "looking for" on this app. Multiple tags may be specified at one time, and the results will display users that meet all of these requirements. Users can also choose to sort these results by compatibility percentage in increasing or decreasing order.

![alt text](https://dokicupid-seeds.s3-us-west-1.amazonaws.com/explore_search_2.png)



## User Profiles 
When visiting one's own profile page, a user can choose to view, edit, or delete their profile. When editing, users can also attach more photos for their profile or delete any existing photos.

When users visit other users' profiles, they can "like", or request to be matched with, the user they are viewing. If the requested user chooses to "like" them back, a match is created which allows the two users to send messages to one another. 

![alt text](https://dokicupid-seeds.s3-us-west-1.amazonaws.com/profile_page_2.png)



## Matches and Messaging
At the matches page, users can see who they are currently matched with, who they "liked", and who "liked" them. When two users mutually "like" each other, the match is created, and one of the users can start a conversation with the other on the messages page. Real-time chat between matched users is implemented using Action Cable in Rails. 

![alt text](https://dokicupid-seeds.s3-us-west-1.amazonaws.com/matching_messaging_2.png)


Because only one conversation should exist in conversations table of the database for a pair of matched users, I wrote a scope method `:between` in the Conversation model to be used when attempting to create a conversation at the Conversations controller. If the conversation already exists in the database, the existing one is returned; if an existing conversation is not found, the method creates a new conversation between the users and returns that conversation.

```ruby
# app/controllers/api/conversations_controller.rb
def create
  if Conversation.between(
      conversation_params[:sender_id], conversation_params[:recipient_id]
    ).present?
    @conversation = Conversation.between(
      conversation_params[:sender_id],
      conversation_params[:recipient_id]
    ).first
  else
    @conversation = Conversation.create!(conversation_params)
  end
  render :show
end

```
```ruby
# app/models/conversation.rb
scope :between, -> (sender_id, recipient_id) do 
    where(
      "(conversations.sender_id = ? AND conversations.recipient_id = ?) OR (conversations.sender_id = ? AND conversations.recipient_id = ?)", 
      sender_id, recipient_id, recipient_id, sender_id
    )
end
```

One of the more challenging areas of this project was configuring Action Cable for real-time messaging.

In MessagesChannel, I defined a method `create` that takes in data and creates a message in the database with that data. Then, it broadcasts the `socket` object to the "messages_channel" referenced in the `subscribed` method.

```ruby
# app/channels/messages_channel.rb
class MessagesChannel < ApplicationCable::Channel  
  def subscribed
    stream_for 'messages_channel' 
  end

  def create(data) 
    message = Message.create(
      body: data["body"], 
      user_id: data["user_id"], 
      conversation_id: data["conversation_id"]
    )
    socket = { 
      id: message.id, 
      conversation_id: message.conversation_id, 
      body: message.body, 
      user_id: message.user_id, 
      read: message.read, 
      created_at: message.created_at 
    }
    MessagesChannel.broadcast_to("messages_channel", socket)
  end
end  
```

In the MessageShow component below, I call `this.createSocket` once the component mounts. `createSocket` then sets `this.messages`. 

```javascript
// frontend/components/messages/messages_show.jsx
class MessagesShow extends React.Component {
  componentDidMount() {
     this.createSocket();
  }
   
  createSocket() {
    this.messages = App.cable.subscriptions.create({
      channel: 'MessagesChannel'
    }, {
      connected: () => { },
      received: (data) => {
        let messageLogs = this.state.messageLogs;
        messageLogs.push(data);
        this.setState({ messageLogs: messageLogs })
      },
      create: function (messageContent) {
        this.perform('create', 
          messageContent
        );
      }
    });
  }
  
  handleSendEvent(e) {
    e.preventDefault();
    this.messages.create({
      body: this.state.body, 
      conversation_id: this.state.conversationId, 
      user_id: this.state.userId
    });
    this.setState({ body: "" });
  }
}

```



## Technologies Used
1. Javascript
2. Ruby on Rails
3. PostgreSQL 
4. HTML 
5. CSS/SCSS 

## Libraries:
1. React.js
2. Redux 
3. Rails ActionCable for real-time messaging
3. jQuery for AJAX API requests
4. AWS S3 buckets for user avatar and profile photos 
5. BCrypt for User Authentication
6. NPM zipcodes to calculate distance between users
