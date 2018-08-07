""" # The Black-Scholes Formula
# s - Stock price
# k - Strike price
# t - Time to maturity
# r - Risk-free interest rate
# d - Dividend yield
# v - Volatility
"""
from scipy.stats import norm
from math import *


def main(s, k, t, r, d, v):
    d1 = (log(float(s) / k) + ((r - d) + v * v / 2.) * t) / (v * sqrt(t))
    d2 = d1 - v * sqrt(t)
    return s * exp(-d * t) * norm.cdf(d1) - k * exp(-r * t) * norm.cdf(d2)
