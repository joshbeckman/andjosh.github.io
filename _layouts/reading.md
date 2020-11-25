---
layout: default
---

<div class="tag-lead">
  {{ content }}
</div>
<div class="posts reading">
  {% if site.tags[page.slug] %}
    {% for post in site.tags[page.slug] %}
      <div>
        <a href="{{ post.url }}" >
            {{ post.subject_title }}
        </a>
      </div>
      <div>
        {{ post.subject_author }}
      </div>
      <time>{{ post.date | date: "%Y-%m-%d" }}</time>
      <div>
        {% if post.rating == 1 %}
            <div class="stars" style="width:13px"></div>
        {% endif %}
        {% if post.rating == 2 %}
            <div class="stars" style="width:26px"></div>
        {% endif %}
        {% if post.rating == 3 %}
            <div class="stars" style="width:39px"></div>
        {% endif %}
        {% if post.rating == 4 %}
            <div class="stars" style="width:52px"></div>
        {% endif %}
        {% if post.rating == 5 %}
            <div class="stars" style="width:65px"></div>
        {% endif %}
      </div>
    {% endfor %}
  {% else %}
    <blockquote>
      <p>There are no posts with this tag.</p>
    </blockquote>
    <p>View <a href="/posts">all posts</a>.</p>
  {% endif %}
</div>
