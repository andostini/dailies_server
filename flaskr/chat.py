import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)

from flaskr.db import get_db
from flask import session
from flask_socketio import emit, join_room, leave_room
from . import socketio

bp = Blueprint('chat', __name__, url_prefix='/chat')


# --- EVENTS FOR CHAT GO HERE



@socketio.on('joined', namespace="/")
def joined(message):
    """Sent by clients when they enter a room.
    A status message is broadcast to all people in the room."""
    room = message['room']

    join_room(room)
    emit('status', {'msg': session.get('chatName') + ' has entered the room.'}, room=room)


@socketio.on('text', namespace="/")
def text(message):
    """Sent by a client when the user entered a new message.
    The message is sent to all people in the room."""
    room = message['room']

    emit('message', {'msg': session.get('chatName') + ':' + message['msg']}, room=room)


@socketio.on('left', namespace="/")
def left(message):
    """Sent by clients when they leave a room.
    A status message is broadcast to all people in the room."""
    room = message['room']
    leave_room(room)
    emit('status', {'msg': str(session.get('chatName')) + ' has left the room.'}, room=room)





# --- ROUTES FOR CHAT GO HERE

@bp.route('/<room>', methods=['GET', 'POST'])
def chat(room):
    """Login form to enter a room."""

    if request.method == "POST":
        session['chatName'] = request.form['chatName']
        return redirect(url_for('chat.room', room=room))
    else:
        if not session.get('chatName') is None:
            return redirect(url_for('chat.room', room=room))
        else:
            return render_template('chat/chat.html')


@bp.route('/room/<room>')
def room(room):
    """Chat room. The user's name and room must be stored in
    the session."""
    name = session.get('chatName')
    if name == None:
        return redirect(url_for('chat.chat', room = room))
    return render_template('chat/room.html', name=name, room=room)


@bp.route('/leave/<room>')
def leaveChat(room):
    session.pop('chatName')
    return redirect(url_for('chat.chat', room = room))
