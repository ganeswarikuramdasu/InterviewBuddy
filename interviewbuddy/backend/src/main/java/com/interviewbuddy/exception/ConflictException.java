package com.interviewbuddy.exception;

/** Used for invalid state transitions, e.g. duplicate contest registration, submitting a finished test twice. */
public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}
