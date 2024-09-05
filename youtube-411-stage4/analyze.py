import plotly.graph_objs as go
from plotly.subplots import make_subplots
import numpy as np
import plotly.express as px
import plotly.io as pio
import sys
import json
import pandas as pd

def analyze_plot(rows):
    df = pd.DataFrame(rows)
    if len(df) == 0: # when the query return empty
        fig = go.Figure()

        fig.update_layout(
            title="No Data Available",
            xaxis=dict(showgrid=False, zeroline=False, visible=False),
            yaxis=dict(showgrid=False, zeroline=False, visible=False),
            showlegend=False,
            annotations=[
                dict(
                    text="No data to display",
                    xref="paper",
                    yref="paper",
                    showarrow=False,
                    font=dict(size=20)
                )
            ]
        )
        return pio.to_json(fig)

    # compute 'score' on each video's influence (stub), this formula especially penalizes dislikes.
    df['score'] = round(0.2 * df['view_count'] + 0.4 * df['comment_count'] + 0.3 * df['like_count'] - 2 * df['dislike_count'], 2)

    # fig = px.scatter(df, x="view_count", y="like_count", 
    #                  size = "score",
    #                  hover_data = ["video_title", "comment_count", "uploaded_date", "trending_date", "score"],
    #                  log_x=True, 
    #                  log_y=True,
    #                  range_x=[1000,5000000], range_y=[100,1000000],
    #                  title="Video Query Analysis") 
    # # fig.show() only in dev

    # separate the data into two df based on view_count
    df_gold = df[df['view_count'] >= 1000000]
    df_blue = df[df['view_count'] < 1000000]

    # create hover templates, this is for better navigation on video nodes
    hover_template = ('Video Title: %{customdata[0]}<br>' +
                    'View Count: %{x}<br>' +
                    'Like Count: %{y}<br>' +
                    'Comment Count: %{customdata[1]}<br>' +
                    'Uploaded Date: %{customdata[2]}<br>' +
                    'Trending Date: %{customdata[3]}<br>' +
                    'Influence Score: %{customdata[4]}<extra></extra>')

    # create two traces, one for each group, for gold category, the display node is slightly larger
    trace_gold = go.Scatter(x=df_gold['view_count'],
                            y=df_gold['like_count'],
                            customdata=df_gold[['video_title', 'comment_count', 'uploaded_date', 'trending_date', 'score']],
                            mode='markers',
                            marker=dict(size= 1.5 * np.log(df_gold['score'] + 2),
                                        color='gold',
                                        showscale=False),
                            name=">= 1M Views",
                            hovertemplate=hover_template,
                            hoverlabel=dict(font=dict(family='Arial', size=14, color='black')))

    trace_blue = go.Scatter(x=df_blue['view_count'],
                            y=df_blue['like_count'],
                            customdata=df_blue[['video_title', 'comment_count', 'uploaded_date', 'trending_date', 'score']],
                            mode='markers',
                            marker=dict(size= np.log(df_blue['score'] + 2),
                                        color='blue',
                                        showscale=False),
                            name="< 1M Views",
                            hovertemplate=hover_template,
                            hoverlabel=dict(font=dict(family='Arial', size=14, color='white')))

    # combine the traces and create the final plot
    fig = go.Figure([trace_gold, trace_blue])
    fig.update_xaxes(type="log", 
                    range=[3, 7], 
                    title="View Count",
                    title_font=dict(family="Helvetica", size=16, color="black"))
    fig.update_yaxes(type="log", 
                     range=[2, 7],
                     title="Like Count",
                     title_font=dict(family="Helvetica", size=16, color="black"))
    fig.update_layout(title="Video Query Analysis")

    # create an interactive plot here and then pack as json 
    return pio.to_json(fig) # serialize the figure

if __name__ == '__main__':
    input_data = json.loads(sys.stdin.read()) # using fd=0 to read in data from backend
    figure_json = analyze_plot(input_data)
    print(figure_json) # do not wrap it, this works perfectly in front end