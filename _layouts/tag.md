---
layout: default
---

<p>
    All posts tagged with <em>{{ page.slug }}</em>:
</p>
{{ content }}
<div class="posts">
  {% if site.tags[page.slug] %}
    {% for post in site.tags[page.slug] %}
      <div class="post">
        {% if post.image %}
          <div class="post-image">
            <img src="{{ post.image }}" alt="{{ post.title }}"/>
          </div>
        {% elsif post['mf-photo'] %}
          <div class="post-image">
            <img src="{{ post['mf-photo'] }}" alt="{{ post['mf-photo'] }}"/>
          </div>
        {% endif %}
        {% if post.title and post.title != '' %}
            <h2 class="post-title">
                <a href="{{ post.url }}">
                    {{ post.title }}
                </a>
            </h2>
            <div class="post-meta-wrap">
                <div class="post-meta">
                    <a href="{{ post.url }}" class="post-date" rel="bookmark">
                        <time>{{ post.date | date_to_string }}</time>
                    </a>
                </div>
            </div>
        {% else %}
            <a href="{{ post.url }}" class="post-date">
              {{ post.date | date_to_string }}
            </a>
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
