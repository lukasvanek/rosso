import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import * as R from 'ramda';

export const defaultState = {};
export const ioConfig = {
  o: [],
};

function parseMidiMessage(message) {
  return {
    command: message.data[0] >> 4,
    channel: message.data[0] & 0xf,
    note: message.data[1],
    velocity: message.data[2] / 127,
  };
}

const Tones = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const AllTones = R.flatten(
  R.range(1, 7).map((n) => Tones.map((tone) => `${tone}${n}`))
);

// function onPad(pad, velocity) {}
// function onPitchBend(value) {}
// function onModWheel(value) {}

const ExternalMIDI = ({ cid, Actions }) => {
  const tones = useSelector((state) => state.values[cid]);
  const [midiInputs, setMidiInputs] = useState([]);
  const [device, setDevice] = useState({});

  useEffect(() => {
    Actions.setVal([cid, []]);
    navigator.requestMIDIAccess().then((access) => {
      // Get lists of available MIDI controllers
      const inputs = access.inputs.values();
      setMidiInputs(inputs);
      // const outputs = access.outputs.values();
      access.onstatechange = function (e) {
        // Print information about the (dis)connected MIDI controller
        console.log(e.port.name, e.port.manufacturer, e.port.state);
        setDevice(e.port);
      };
    });
  }, []);

  const pushTone = (tone) => {
    if (tones && tones.includes(tone)) return;
    console.log('push', tones);
    Actions.setVal([cid, [...tones, tone]]);
  };

  const shiftTone = (tone) => {
    console.log('shift', tone);
    const newArr = tones.filter((t) => t !== tone);
    Actions.setVal([cid, newArr]);
  };

  const onNote = (noteCode, velocity) => {
    const noteN = noteCode - 36;
    const note = AllTones[noteN];
    if (velocity > 0) pushTone(note);
    else shiftTone(note);
  };

  const getMIDIMessage = (message) => {
    // Parse the MIDIMessageEvent.
    const { command, channel, note, velocity } = parseMidiMessage(message);
    // Stop command.
    // Negative velocity is an upward release rather than a downward press.
    if (command === 8) {
      if (channel === 0) onNote(note, -velocity);
      //else if (channel === 9) onPad(note, -velocity)
    }
    // Start command.
    //else if (command === 9) {
    //  if      (channel === 0) onNote(note, velocity)
    //  else if (channel === 9) onPad(note, velocity)
    //}
    //// Knob command.
    //else if (command === 11) {
    //  if (note === 1) onModWheel(velocity)
    //}
    //// Pitch bend command.
    //else if (command === 14) {
    //  onPitchBend(velocity)
    //}
  };

  useEffect(() => {
    console.log('midiInputs');
    for (const input of midiInputs) {
      input.onmidimessage = getMIDIMessage;
    }
  }, [midiInputs]);

  return (
    <div>
      <h2>External MIDI</h2>
      <div>{device.name}</div>
      <div>{device.manufacturer}</div>
      Input: {tones}
    </div>
  );
};

export default ExternalMIDI;
