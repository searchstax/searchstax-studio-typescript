import React, { useEffect, useState } from 'react';
import './Feedback.css';

import { trackEvent } from '../../api/reporting';

import type { event } from '../../interface/report';

export function Feedback (props: {
  sessionId?: string,
  uuid?: string,
}): JSX.Element {
  const {
    sessionId = '',
    uuid = ''
  } = props;
  const [flyoutOpen, setFlyoutOpen] = useState<boolean>(false);
  const [score, setScore] = useState<number>(-1);
  const [scoreValid, setScoreValid] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [remainingCharacters, setRemainingCharacters] = useState<number>(2000);
  const [emailValid, setEmailValid] = useState<number>(0);
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    flyoutOpen && validateForm();
  }, [email, score]);

  const submitFeedback = (): void => {
    if (emailValid === 1) {
      setLoading(true);
      const reportData: event = {
        event: '_searchSatisfaction',
        properties: {
          session: sessionId,
          email,
          score,
          comments: comment,
          _vid: uuid
        }
      }
      void trackEvent(reportData)
        .then(() => {
          setLoading(false);
          setFlyoutOpen(false);
          setScore(-1);
          setScoreValid(0);
          setComment('');
          setRemainingCharacters(2000);
          setEmail('');
          setEmailValid(0);
        });
    } else {
      validateForm();
    }
  }

  const validateForm = (): void => {
    if (email.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/) !== null) {
      setEmailValid(1);
    } else {
      setEmailValid(-1);
    }
    if (score >= 0 && score <= 10) {
      setScoreValid(1);
    } else {
      setScoreValid(-1);
    }
  }

  return (
    <div className="Feedback">
      <button
        className="Feedback-button"
        onClick={() => {
          setFlyoutOpen(!flyoutOpen);
        }}
      >
        [ - ] Search Feedback
      </button>
      {flyoutOpen && (
        <div className="Feedback-flyout">
          <div className="Feedback-flyout-header">
            Search Feedback
            <button
              onClick={() => {
                setFlyoutOpen(false);
              }}
            />
          </div>
          <div className="Feedback-flyout-form">
            How would you rate your search experience?
            <div className="Feedback-flyout-form-rating">
              <label htmlFor="sf-rate-0">
                <input type="radio" value="0" name="rating" id="sf-rate-0" checked={score === 0} onClick={() => { setScore(0) }} />
                0
              </label>
              <label htmlFor="sf-rate-0">
                <input type="radio" value="1" name="rating" id="sf-rate-1" checked={score === 1} onClick={() => { setScore(1) }} />
                1
              </label>
              <label htmlFor="sf-rate-0">
                <input type="radio" value="2" name="rating" id="sf-rate-2" checked={score === 2} onClick={() => { setScore(2) }} />
                2
              </label>
              <label htmlFor="sf-rate-0">
                <input type="radio" value="3" name="rating" id="sf-rate-3" checked={score === 3} onClick={() => { setScore(3) }} />
                3
              </label>
              <label htmlFor="sf-rate-0">
                <input type="radio" value="4" name="rating" id="sf-rate-4" checked={score === 4} onClick={() => { setScore(4) }} />
                4
              </label>
              <label htmlFor="sf-rate-0">
                <input type="radio" value="5" name="rating" id="sf-rate-5" checked={score === 5} onClick={() => { setScore(5) }} />
                5
              </label>
              <label htmlFor="sf-rate-0">
                <input type="radio" value="6" name="rating" id="sf-rate-6" checked={score === 6} onClick={() => { setScore(6) }} />
                6
              </label>
              <label htmlFor="sf-rate-0">
                <input type="radio" value="7" name="rating" id="sf-rate-7" checked={score === 7} onClick={() => { setScore(7) }} />
                7
              </label>
              <label htmlFor="sf-rate-0">
                <input type="radio" value="8" name="rating" id="sf-rate-8" checked={score === 8} onClick={() => { setScore(8) }} />
                8
              </label>
              <label htmlFor="sf-rate-0">
                <input type="radio" value="9" name="rating" id="sf-rate-9" checked={score === 9} onClick={() => { setScore(9) }} />
                9
              </label>
              <label htmlFor="sf-rate-0">
                <input type="radio" value="10" name="rating" id="sf-rate-10" checked={score === 10} onClick={() => { setScore(10) }} />
                10
              </label>
            </div>
            <div className="Feedback-flyout-form-rating">
              <span>0 = Very Dissatisfied</span>
              <span>10 = Very Satisfied</span>
            </div>{scoreValid === -1 && (
              <div className="Feedback-flyout-form-error">Please select a score</div>
            )}
            <div className="Feedback-flyout-form-comment">
              <strong>Comments</strong> ({remainingCharacters} characters remaining)
            </div>
            <textarea
              maxLength={2000}
              onChange={(event) => {
                setComment(event.target.value);
                setRemainingCharacters(2000 - event.target.value.length);
              }}
              value={comment}
            />
            <div>Email</div>
            <input
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              value={email}
              type="text"
            />
            {emailValid === -1 && (
              <div className="Feedback-flyout-form-error">Please enter a valid email address</div>
            )}
          </div>
          <div className="Feedback-flyout-footer">
            <img className="Feedback-flyout-footer-image" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI0LjIuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxMzEuNSAzOS44IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMzEuNSAzOS44OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6I0ZDNjczMDt9Cgkuc3Qxe2ZpbGw6IzMzNDc1QTt9Cgkuc3Qye2VuYWJsZS1iYWNrZ3JvdW5kOm5ldyAgICA7fQo8L3N0eWxlPgo8Zz4KCTxnIGlkPSJsb2dvX3g1Rl9jb2xvcl8xXyI+CgkJPGc+CgkJCTxnPgoJCQkJPGcgaWQ9IlhNTElEXzhfIj4KCQkJCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMC4zLDMxLjhMMS44LDMxYzAuMS0wLjEsMC4zLTAuMSwwLjUsMGw3LjQsNC4yYzAuMSwwLjEsMC4zLDAuMSwwLjUsMGw3LjMtNC4yYzAuMi0wLjEsMC4zLTAuMSwwLjUsMAoJCQkJCQlsMS40LDAuOWMwLjMsMC4yLDAuMywwLjYsMCwwLjhsLTkuMiw1LjRjLTAuMSwwLjEtMC4zLDAuMS0wLjUsMGwtOS40LTUuNEMwLDMyLjUsMCwzMiwwLjMsMzEuOHoiLz4KCQkJCTwvZz4KCQkJCTxnIGlkPSJYTUxJRF83XyI+CgkJCQkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTAuMywyNi41bDEuNi0wLjljMC4xLTAuMSwwLjMtMC4xLDAuNSwwbDcuMiw0LjJjMC4xLDAuMSwwLjMsMC4xLDAuNSwwbDcuMy00LjJjMC4xLTAuMSwwLjItMC4yLDAuMi0wLjQKCQkJCQkJVjI0YzAtMC40LTAuNC0wLjYtMC43LTAuNGwtNi43LDMuOWMtMC4xLDAuMS0wLjMsMC4xLTAuNSwwTDAuMiwyMmMtMC4zLTAuMi0wLjMtMC42LDAtMC44bDkuMy01LjVjMC4xLTAuMSwwLjMtMC4xLDAuNSwwCgkJCQkJCWw1LjMsM2MwLjMsMC4yLDAuMywwLjYsMCwwLjhsLTEuNCwwLjljLTAuMiwwLjEtMC4zLDAuMS0wLjUsMGwtMy40LTJjLTAuMi0wLjEtMC4zLTAuMS0wLjUsMGwtNC40LDIuN2MtMC4zLDAuMi0wLjMsMC42LDAsMC44CgkJCQkJCWw0LjQsMi42YzAuMSwwLjEsMC4zLDAuMSwwLjUsMGw3LjMtNC4yYzAuMS0wLjEsMC4zLTAuMSwwLjUsMGwyLDEuMWMwLjIsMC4xLDAuMiwwLjIsMC4yLDAuNHY0LjdjMCwwLjItMC4xLDAuMy0wLjIsMC40CgkJCQkJCWwtOS42LDUuN2MtMC4xLDAuMS0wLjMsMC4xLTAuNSwwbC05LjQtNS41Qy0wLjEsMjcuMi0wLjEsMjYuNywwLjMsMjYuNXoiLz4KCQkJCTwvZz4KCQkJPC9nPgoJCQk8ZyBpZD0iRElOX3g1Rl9OZXh0X3g1Rl9MVF94NUZfUHJvX3g1Rl9MaWdodF94MEFfXzFfIj4KCQkJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yNC45LDMxLjNjLTAuMS0wLjEtMC4xLTAuMiwwLTAuMmwwLjQtMC41YzAuMS0wLjEsMC4yLTAuMSwwLjIsMGMwLjcsMC42LDEuOSwxLjEsMy4yLDEuMQoJCQkJCWMxLjgsMCwyLjgtMC45LDIuOC0yLjJjMC0xLjEtMC42LTEuOS0yLjYtMi4xbC0wLjUtMC4xYy0yLjEtMC4zLTMuMi0xLjMtMy4yLTIuOWMwLTEuOSwxLjQtMy4xLDMuNS0zLjFjMS4yLDAsMi40LDAuNCwzLjEsMC45CgkJCQkJYzAuMSwwLDAuMSwwLjEsMCwwLjJsLTAuMywwLjVjLTAuMSwwLjEtMC4xLDAuMS0wLjIsMGMtMC45LTAuNS0xLjctMC44LTIuNy0wLjhjLTEuNiwwLTIuNSwwLjktMi41LDIuMWMwLDEuMSwwLjcsMS44LDIuNiwyLjEKCQkJCQlsMC41LDAuMWMyLjIsMC4zLDMuMiwxLjMsMy4yLDNjMCwxLjktMS4zLDMuMi0zLjksMy4yQzI3LjEsMzIuNiwyNS43LDMyLDI0LjksMzEuM3oiLz4KCQkJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zNi42LDIxLjZjMC0wLjEsMC4xLTAuMiwwLjItMC4yaDYuM2MwLjEsMCwwLjIsMC4xLDAuMiwwLjJ2MC42YzAsMC4xLTAuMSwwLjItMC4yLDAuMmgtNQoJCQkJCWMtMC4zLDAtMC42LDAuMy0wLjYsMC42djNjMCwwLjMsMC4zLDAuNiwwLjYsMC42aDQuMmMwLjEsMCwwLjIsMC4xLDAuMiwwLjJ2MC42YzAsMC4xLTAuMSwwLjItMC4yLDAuMmgtNC4yCgkJCQkJYy0wLjMsMC0wLjYsMC4zLTAuNiwwLjZWMzFjMCwwLjMsMC4zLDAuNiwwLjYsMC42aDVjMC4xLDAsMC4yLDAuMSwwLjIsMC4ydjAuNmMwLDAuMS0wLjEsMC4yLTAuMiwwLjJoLTYuMwoJCQkJCWMtMC4xLDAtMC4yLTAuMS0wLjItMC4yVjIxLjZ6Ii8+CgkJCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNTAuMSwyMS42YzAtMC4xLDAuMS0wLjIsMC4yLTAuMmgwLjZjMC4xLDAsMC4yLDAuMSwwLjIsMC4ybDMuOCwxMC43YzAsMC4xLDAsMC4yLTAuMSwwLjJoLTAuNwoJCQkJCWMtMC4xLDAtMC4yLDAtMC4yLTAuMkw1MywyOS45Yy0wLjEtMC4yLTAuMi0wLjMtMC40LTAuM2gtNC4xYy0wLjIsMC0wLjQsMC4xLTAuNCwwLjNsLTAuOSwyLjRjMCwwLjEtMC4xLDAuMi0wLjIsMC4yaC0wLjYKCQkJCQljLTAuMSwwLTAuMS0wLjEtMC4xLTAuMkw1MC4xLDIxLjZ6IE01MS45LDI4LjdjMC4zLDAsMC42LTAuMywwLjQtMC42TDUwLjUsMjNsMCwwbC0xLjgsNWMtMC4xLDAuMywwLjEsMC42LDAuNCwwLjZoMi44VjI4Ljd6IgoJCQkJCS8+CgkJCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNjUsMzIuNGMtMC4xLDAtMC4xLDAtMC4yLTAuMWwtMi4zLTQuOGgtMC4ySDYwYy0wLjMsMC0wLjYsMC4zLTAuNiwwLjZ2NC4yYzAsMC4xLTAuMSwwLjItMC4yLDAuMmgtMC42CgkJCQkJYy0wLjEsMC0wLjItMC4xLTAuMi0wLjJWMjEuNmMwLTAuMSwwLjEtMC4yLDAuMi0wLjJoMy43YzIuMSwwLDMuNCwxLjIsMy40LDNjMCwxLjMtMC42LDIuMy0xLjgsMi44Yy0wLjMsMC4xLTAuNCwwLjQtMC4yLDAuNgoJCQkJCWwyLjEsNC40YzAuMSwwLjEsMCwwLjItMC4xLDAuMkg2NUw2NSwzMi40eiBNNjQuOCwyNC41YzAtMS40LTAuOS0yLjItMi40LTIuMkg2MGMtMC4zLDAtMC42LDAuMy0wLjYsMC42djMuMgoJCQkJCWMwLDAuMywwLjMsMC42LDAuNiwwLjZoMi4zQzYzLjksMjYuNiw2NC44LDI1LjksNjQuOCwyNC41eiIvPgoJCQkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTY5LjYsMjYuOWMwLTAuOCwwLTEuNSwwLjEtMS45YzAuMi0yLjMsMi4zLTQuMSw0LjYtMy42YzEuMSwwLjIsMS45LDAuOSwyLjQsMS45YzAsMC4xLDAsMC4yLDAsMC4yCgkJCQkJbC0wLjUsMC4zYy0wLjEsMC0wLjIsMC0wLjItMC4xYy0wLjUtMC45LTEuMy0xLjYtMi41LTEuNmMtMS4zLDAtMi4yLDAuNi0yLjYsMS44Yy0wLjEsMC40LTAuMiwxLjEtMC4yLDNjMCwxLjgsMC4xLDIuNSwwLjIsMwoJCQkJCWMwLjQsMS4yLDEuMiwxLjgsMi42LDEuOGMxLjIsMCwyLTAuNiwyLjUtMS42YzAtMC4xLDAuMS0wLjEsMC4yLTAuMWwwLjUsMC4zYzAuMSwwLDAuMSwwLjEsMCwwLjJjLTAuNiwxLjMtMS44LDItMy4zLDIKCQkJCQljLTEuNywwLTIuOS0wLjgtMy41LTIuNUM2OS43LDI5LjYsNjkuNiwyOC44LDY5LjYsMjYuOXoiLz4KCQkJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik04MC42LDIxLjZjMC0wLjEsMC4xLTAuMiwwLjItMC4yaDAuNmMwLjEsMCwwLjIsMC4xLDAuMiwwLjJ2NC4yYzAsMC4zLDAuMywwLjYsMC42LDAuNmg0LjUKCQkJCQljMC4zLDAsMC42LTAuMywwLjYtMC42di00LjJjMC0wLjEsMC4xLTAuMiwwLjItMC4yaDAuNmMwLjEsMCwwLjIsMC4xLDAuMiwwLjJ2MTAuN2MwLDAuMS0wLjEsMC4yLTAuMiwwLjJoLTAuNgoJCQkJCWMtMC4xLDAtMC4yLTAuMS0wLjItMC4ydi00LjRjMC0wLjMtMC4zLTAuNi0wLjYtMC42aC00LjVjLTAuMywwLTAuNiwwLjMtMC42LDAuNnY0LjRjMCwwLjEtMC4xLDAuMi0wLjIsMC4yaC0wLjYKCQkJCQljLTAuMSwwLTAuMi0wLjEtMC4yLTAuMlYyMS42TDgwLjYsMjEuNnoiLz4KCQkJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik05Mi4zLDMxLjNjLTAuMS0wLjEtMC4xLTAuMiwwLTAuMmwwLjQtMC41YzAuMS0wLjEsMC4yLTAuMSwwLjIsMGMwLjcsMC42LDEuOSwxLjEsMy4yLDEuMQoJCQkJCWMxLjgsMCwyLjgtMC45LDIuOC0yLjJjMC0xLjEtMC42LTEuOS0yLjYtMi4xbC0wLjUtMC4xYy0yLjEtMC4zLTMuMi0xLjMtMy4yLTIuOWMwLTEuOSwxLjQtMy4xLDMuNS0zLjFjMS4yLDAsMi40LDAuNCwzLjEsMC45CgkJCQkJYzAuMSwwLDAuMSwwLjEsMCwwLjJsLTAuMywwLjVjLTAuMSwwLjEtMC4xLDAuMS0wLjIsMGMtMC45LTAuNS0xLjctMC44LTIuNy0wLjhjLTEuNiwwLTIuNSwwLjktMi41LDIuMWMwLDEuMSwwLjcsMS44LDIuNiwyLjEKCQkJCQlsMC41LDAuMWMyLjIsMC4zLDMuMiwxLjMsMy4yLDNjMCwxLjktMS4zLDMuMi0zLjksMy4yQzk0LjUsMzIuNiw5MywzMiw5Mi4zLDMxLjN6Ii8+CgkJCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTA2LjIsMzIuNGMtMC4xLDAtMC4yLTAuMS0wLjItMC4ydi05LjRjMC0wLjMtMC4zLTAuNi0wLjYtMC42aC0yLjdjLTAuMSwwLTAuMi0wLjEtMC4yLTAuMnYtMC42CgkJCQkJYzAtMC4xLDAuMS0wLjIsMC4yLTAuMmg3LjRjMC4xLDAsMC4yLDAuMSwwLjIsMC4yVjIyYzAsMC4xLTAuMSwwLjItMC4yLDAuMmgtMi43Yy0wLjMsMC0wLjYsMC4zLTAuNiwwLjZ2OS40CgkJCQkJYzAsMC4xLTAuMSwwLjItMC4yLDAuMkgxMDYuMkwxMDYuMiwzMi40eiIvPgoJCQkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTExNS41LDIxLjZjMC0wLjEsMC4xLTAuMiwwLjItMC4yaDAuNmMwLjEsMCwwLjIsMC4xLDAuMiwwLjJsMy44LDEwLjdjMCwwLjEsMCwwLjItMC4xLDAuMmgtMC42CgkJCQkJYy0wLjEsMC0wLjIsMC0wLjItMC4ybC0wLjktMi40Yy0wLjEtMC4yLTAuMi0wLjMtMC40LTAuM0gxMTRjLTAuMiwwLTAuNCwwLjEtMC40LDAuM2wtMC45LDIuNGMwLDAuMS0wLjEsMC4yLTAuMiwwLjJoLTAuNgoJCQkJCWMtMC4xLDAtMC4xLTAuMS0wLjEtMC4yTDExNS41LDIxLjZ6IE0xMTcuNCwyOC43YzAuMywwLDAuNi0wLjMsMC40LTAuNkwxMTYsMjNsMCwwbC0xLjgsNS4xYy0wLjEsMC4zLDAuMSwwLjYsMC40LDAuNkgxMTcuNHoiCgkJCQkJLz4KCQkJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMjkuOSwzMi40Yy0wLjEsMC0wLjIsMC0wLjItMC4xbC0yLjgtNC43bDAsMGwtMi44LDQuN2MwLDAuMS0wLjEsMC4xLTAuMiwwLjFoLTAuNwoJCQkJCWMtMC4xLDAtMC4xLTAuMS0wLjEtMC4ybDMuMi01LjNjMC4xLTAuMiwwLjEtMC4zLDAtMC41bC0yLjktNC44Yy0wLjEtMC4xLDAtMC4yLDAuMS0wLjJoMC43YzAuMSwwLDAuMiwwLDAuMiwwLjFsMi41LDQuMmwwLDAKCQkJCQlsMi41LTQuMmMwLjEtMC4xLDAuMS0wLjEsMC4yLTAuMWgwLjdjMC4xLDAsMC4xLDAuMSwwLjEsMC4ybC0yLjksNC44Yy0wLjEsMC4yLTAuMSwwLjMsMCwwLjVsMy4yLDUuM2MwLDAuMSwwLDAuMi0wLjEsMC4yCgkJCQkJSDEyOS45TDEyOS45LDMyLjR6Ii8+CgkJCTwvZz4KCQk8L2c+Cgk8L2c+Cgk8ZyBjbGFzcz0ic3QyIj4KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMS40LDIuMUMyLDIsMi42LDEuOSwzLjUsMS45YzEsMCwxLjgsMC4yLDIuMywwLjdjMC40LDAuNCwwLjcsMSwwLjcsMS43QzYuNCw1LDYuMiw1LjYsNS44LDYKCQkJQzUuMyw2LjYsNC40LDYuOSwzLjMsNi45Yy0wLjMsMC0wLjYsMC0wLjgtMC4xVjEwaC0xVjIuMXogTTIuNSw2QzIuNyw2LDMsNiwzLjQsNmMxLjMsMCwyLTAuNiwyLTEuN2MwLTEuMS0wLjgtMS42LTEuOS0xLjYKCQkJYy0wLjUsMC0wLjgsMC0xLDAuMVY2eiIvPgoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMi44LDcuMWMwLDIuMS0xLjUsMy4xLTIuOSwzLjFjLTEuNiwwLTIuOC0xLjItMi44LTNjMC0xLjksMS4zLTMuMSwyLjktMy4xQzExLjYsNC4xLDEyLjgsNS4zLDEyLjgsNy4xegoJCQkgTTguMSw3LjJjMCwxLjMsMC43LDIuMiwxLjgsMi4yYzEsMCwxLjgtMC45LDEuOC0yLjNjMC0xLTAuNS0yLjItMS43LTIuMkM4LjcsNC45LDguMSw2LDguMSw3LjJ6Ii8+CgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE0LjQsNC4ybDAuOCwzYzAuMiwwLjYsMC4zLDEuMiwwLjQsMS44aDBjMC4xLTAuNiwwLjMtMS4yLDAuNS0xLjhsMC45LTNIMThsMC45LDIuOQoJCQljMC4yLDAuNywwLjQsMS4zLDAuNSwxLjloMGMwLjEtMC42LDAuMy0xLjIsMC40LTEuOWwwLjgtMi45aDFMMTkuOSwxMGgtMWwtMC45LTIuOGMtMC4yLTAuNi0wLjQtMS4yLTAuNS0xLjloMAoJCQljLTAuMSwwLjctMC4zLDEuMy0wLjUsMS45TDE2LjEsMTBoLTFsLTEuOC01LjhIMTQuNHoiLz4KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjMuMyw3LjNjMCwxLjQsMC45LDIsMiwyYzAuOCwwLDEuMi0wLjEsMS42LTAuM2wwLjIsMC44Yy0wLjQsMC4yLTEsMC40LTEuOSwwLjRjLTEuOCwwLTIuOS0xLjItMi45LTIuOQoJCQlzMS0zLjEsMi43LTMuMWMxLjksMCwyLjQsMS43LDIuNCwyLjdjMCwwLjIsMCwwLjQsMCwwLjVIMjMuM3ogTTI2LjQsNi42YzAtMC43LTAuMy0xLjctMS41LTEuN2MtMS4xLDAtMS41LDEtMS42LDEuN0gyNi40eiIvPgoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yOC43LDZjMC0wLjcsMC0xLjMsMC0xLjhoMC45bDAsMS4xaDBjMC4zLTAuOCwwLjktMS4zLDEuNi0xLjNjMC4xLDAsMC4yLDAsMC4zLDB2MWMtMC4xLDAtMC4yLDAtMC40LDAKCQkJYy0wLjcsMC0xLjMsMC42LTEuNCwxLjRjMCwwLjEsMCwwLjMsMCwwLjVWMTBoLTFWNnoiLz4KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMzMuMSw3LjNjMCwxLjQsMC45LDIsMiwyYzAuOCwwLDEuMi0wLjEsMS42LTAuM2wwLjIsMC44Yy0wLjQsMC4yLTEsMC40LTEuOSwwLjRjLTEuOCwwLTIuOS0xLjItMi45LTIuOQoJCQlzMS0zLjEsMi43LTMuMWMxLjksMCwyLjQsMS43LDIuNCwyLjdjMCwwLjIsMCwwLjQsMCwwLjVIMzMuMXogTTM2LjIsNi42YzAtMC43LTAuMy0xLjctMS41LTEuN2MtMS4xLDAtMS41LDEtMS42LDEuN0gzNi4yeiIvPgoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik00My42LDEuNXY3YzAsMC41LDAsMS4xLDAsMS41aC0wLjlsMC0xaDBjLTAuMywwLjYtMSwxLjEtMiwxLjFjLTEuNCwwLTIuNS0xLjItMi41LTNjMC0xLjksMS4yLTMuMSwyLjYtMy4xCgkJCWMwLjksMCwxLjUsMC40LDEuOCwwLjloMFYxLjVINDMuNnogTTQyLjUsNi42YzAtMC4xLDAtMC4zLDAtMC40Yy0wLjItMC43LTAuNy0xLjItMS41LTEuMmMtMS4xLDAtMS43LDEtMS43LDIuMgoJCQljMCwxLjIsMC42LDIuMSwxLjcsMi4xYzAuNywwLDEuNC0wLjUsMS41LTEuM2MwLTAuMSwwLTAuMywwLTAuNVY2LjZ6Ii8+CgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTQ3LjgsMTBjMC0wLjQsMC0xLDAtMS41di03aDF2My42aDBjMC40LTAuNiwxLTEuMSwyLTEuMWMxLjQsMCwyLjUsMS4yLDIuNCwzYzAsMi4xLTEuMywzLjEtMi42LDMuMQoJCQljLTAuOCwwLTEuNS0wLjMtMS45LTEuMWgwbDAsMUg0Ny44eiBNNDguOSw3LjdjMCwwLjEsMCwwLjMsMCwwLjRjMC4yLDAuNywwLjgsMS4yLDEuNiwxLjJjMS4xLDAsMS44LTAuOSwxLjgtMi4yCgkJCWMwLTEuMi0wLjYtMi4yLTEuNy0yLjJjLTAuNywwLTEuNCwwLjUtMS42LDEuM2MwLDAuMS0wLjEsMC4zLTAuMSwwLjRWNy43eiIvPgoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik01NSw0LjJsMS4zLDMuNGMwLjEsMC40LDAuMywwLjgsMC40LDEuMmgwYzAuMS0wLjMsMC4yLTAuOCwwLjQtMS4ybDEuMi0zLjRoMS4xbC0xLjYsNC4xYy0wLjgsMi0xLjMsMy0yLDMuNgoJCQljLTAuNSwwLjUtMSwwLjYtMS4zLDAuN2wtMC4zLTAuOWMwLjMtMC4xLDAuNi0wLjMsMC45LTAuNWMwLjMtMC4yLDAuNi0wLjYsMC45LTEuMkM1NiwxMCw1Niw5LjksNTYsOS45YzAtMC4xLDAtMC4xLTAuMS0wLjMKCQkJbC0yLjEtNS4zSDU1eiIvPgoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik02MC4zLDUuMmMwLTAuNCwwLjMtMC44LDAuNy0wLjhjMC40LDAsMC43LDAuMywwLjcsMC44YzAsMC40LTAuMywwLjctMC43LDAuN0M2MC42LDUuOSw2MC4zLDUuNiw2MC4zLDUuMnoKCQkJIE02MC4zLDkuNGMwLTAuNCwwLjMtMC44LDAuNy0wLjhjMC40LDAsMC43LDAuMywwLjcsMC44YzAsMC40LTAuMywwLjctMC43LDAuN0M2MC42LDEwLjIsNjAuMyw5LjksNjAuMyw5LjR6Ii8+Cgk8L2c+CjwvZz4KPC9zdmc+Cg==" />
            <button
              onClick={submitFeedback}
              disabled={loading}
            >
              {loading
                ? <div className="Feedback-submit-loading" />
                : <>Send</>
              }
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
