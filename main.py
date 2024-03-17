import string
import re
import matplotlib.pyplot  as plt
import numpy as np
import pandas as pd
import math as math
import sympy as sympy
import io
from flask import Flask, request, jsonify
from flask_cors import CORS
import json

operations = {
    0:"Lista operacji",
    1:"Wykres Funkcji",
    2:"Miejsca Zerowe",
    3:"Pochodna",
    4:"Przedziały monotoniczności",
    5:"Dziedzina",
    6:"Granica w punkcie",
    7:"Rozwiązywanie równań",
    #8:"Rozwiązywanie nierówności"
}

def create_axis(x,y,formula):
    fig, ax = plt.subplots(figsize=(20, 20))

    fig.patch.set_facecolor('#ffffff')

    values = pd.Series(y,index=x)
    values.round(7)
    values.plot(ax=ax)
    xmin, xmax, ymin, ymax = x.min(), x.max(), y.min(), y.max()

    ticks_frequency = 1

    ax.set(xlim=(ymin, ymax), ylim=(ymin, ymax), aspect='equal')
    ax.set_title('Wykres funkcji f(x) = ' + formula)
    ax.spines['bottom'].set_position('zero')
    ax.spines['left'].set_position('zero')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    x_ticks = np.arange(xmin, ymax + 1, ticks_frequency)
    y_ticks = np.arange(ymin, ymax + 1, ticks_frequency)
    ax.set_xticks(x_ticks[x_ticks != 0])
    ax.set_yticks(y_ticks[y_ticks != 0])
    ax.set_xticks(np.arange(xmin, xmax + 1), minor=True)
    ax.set_yticks(np.arange(ymin, ymax + 1), minor=True)
    ax.set_xlabel('$x$', size=14, labelpad=-24, x=1.02)
    ax.set_ylabel('$y$', size=14, labelpad=-21, y=1.02, rotation=0)
    plt.text(0.49, 0.49, r"$.$", ha='right', va='top',
             transform=ax.transAxes,
             horizontalalignment='center', fontsize=14)
    ax.grid(which='both', color='grey', linewidth=1, linestyle='-', alpha=0.2)

    #plt.show()

    buffer = io.BytesIO()
    plt.savefig(buffer, format='svg')
    buffer.seek(0)
    svg_data = buffer.getvalue().decode()

    plt.close();
    svg_data = svg_data.replace("""<?xml version="1.0" encoding="utf-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
  "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">""","")
    print(svg_data)
    return svg_data

def execute_function(formula):
    expression = sympy.parse_expr(formula)

    f = sympy.lambdify('x',expression)

    zero_places = find_zero_places(expression)
    if(len(zero_places)==0):
        zero_places.append(0)
    print(zero_places)
    z1 = float(max(zero_places))
    z2 = float(min(zero_places))
    x = np.arange(z2-3, z1+3, 0.01)

    y = f(x)

    return  create_axis(x,y,formula)

def find_monotonicy_intervals(expression):
    expr = sympy.parse_expr(expression)

    diff = sympy.diff(expression)
    critical_points = sympy.solve(diff)
    #print("Punkty krytyczne:", critical_points)
    monotonic_intervals = []
    if(len(critical_points)>1):
        monotonic_intervals.append(("-∞",critical_points[0]))
        for i in range(len(critical_points) - 1):
            interval = (critical_points[i], critical_points[i + 1])
            monotonic_intervals.append(interval)
        monotonic_intervals.append(( critical_points[-1],"+∞",))
    else:
        monotonic_intervals.append(("-∞",critical_points[0]))
        monotonic_intervals.append(( critical_points[0],"+∞",))

    #print("Przedziały monotoniczności:", monotonic_intervals)
    return "".join([str(inter)+'\n' for inter in monotonic_intervals])

def find_zero_places(expression):
    return sympy.solve(sympy.Eq(expression,0))

def find_domain(expression):
    expr = sympy.parse_expr(expression)
    domain = sympy.calculus.util.continuous_domain(expr,sympy.symbols('x'),domain=sympy.S.Reals)
    compl = sympy.Complement( sympy.S.Reals, domain )
    return   repr(compl)

def get_limes_for_x(formula,limstone):
    formula = re.sub(r'[a-zA-Z]','x',formula)
    expression = sympy.parse_expr(formula)
    print(formula,limstone)
    lim = sympy.limit(expression,sympy.symbols('x'),limstone)
    print(lim)
    return  str(lim)

def handler(data, task):
    if '=' in data:
        splitted = data.split('=')
    else:
        splitted = ['',data]
    formula = splitted[1]
    response = ""

    if(task==0):
        response = json.dumps(operations)

    if(task==1):
        response = execute_function(formula)
    if (task == 2):
        tmp = find_zero_places(sympy.parse_expr(formula))
        tmp2 = "".join([','+str(z) for z in tmp])[1:]+"}"
        response = "x &isin; {"+tmp2
    if(task == 3):
       response = " f'(x) = " +str(sympy.diff(sympy.parse_expr(formula)));
    if(task == 4):
        response = find_monotonicy_intervals(formula)
    if (task == 5):
        exclude = find_domain(formula)
        if(exclude=="EmptySet"):
            response = "R"
        else:
            response = "R-"+exclude
        response = "D = " + response
    if (task == 6):
        limstone = formula
        print(limstone)
        limstone = limstone.replace("lim","")
        splitted2 = limstone.split('[')
        limstone = splitted2[0]
        formula = splitted2[1]
        formula = formula.replace(']',"")
        limstone = re.sub(r'[a-zA-Z]', '', limstone)
        limstone = limstone.replace("->", "")
        limstone = limstone.strip()
        response = data + " = " + get_limes_for_x(formula,limstone)
    if(task==7):
        left = splitted[0]
        right = splitted[1]
        expr = sympy.parse_expr(left + "- (" + right + ")")
        solution = sympy.solve(expr)
        tmp = "".join(","+str(el) for el in solution)
        response = "{"+tmp[1:]+"}"
    print(response)
    return response

app = Flask('calculator')
CORS(app)

@app.route('/solve', methods=['POST'])
def solver():
    temp = json.loads(request.get_data())
    task = int(temp['task'])
    data = temp['data']
    response = handler(data,task)
    return jsonify({"data":response})

app.run(port="8080")